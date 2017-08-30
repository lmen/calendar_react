import * as React from 'react';
import * as Mon from 'moment';
import { CalendarDropDown } from './dropDown';
import { CalendarState } from './redux/state';
import { CalendarStateSubscriber, Store, } from './redux/dispatcher';
import { DataChanged, OpenDropDown, InitState, CloseDropDownUserReectSelection } from './redux/actions';
import {
    DateTimeToString, convertDateTimeToMom, areDateTimeDifferent,
    convertMomToDateTime, DateTime
} from './redux/dateTime';
import { createFinalConfig } from './redux/config';

export interface Config {
    locale_code: string;
    showSeconds?: boolean;
    showTimeZone?: boolean;
    showAmPm?: boolean;
}

interface CProps {
    date: Mon.Moment | null;
    config: Config;
    onDateChange: (newDate: Mon.Moment | null) => void;
}

export class Calendar extends React.PureComponent<CProps, CalendarState> implements CalendarStateSubscriber {

    private dispatcher: Store;

    constructor(props: CProps) {
        super(props);

        let finalConfig = createFinalConfig(props.config);
        let showAm = finalConfig.showAmPm as boolean;
        let showSec = finalConfig.showSeconds as boolean;

        let initUserDate = convertMomToDateTime(this.props.date, showAm, showSec);
        let displayDate = initUserDate || convertMomToDateTime(Mon(), showAm, showSec);

        this.dispatcher = new Store(new InitState(initUserDate, displayDate as DateTime, finalConfig), this);

        this.state = this.dispatcher.getCurrentState();

        this.handleClickInInput = this.handleClickInInput.bind(this);
        this.handleChangeInInput = this.handleChangeInInput.bind(this);
        this.handleClickOutsideCalendarArea = this.handleClickOutsideCalendarArea.bind(this);
        this.handleClickInCalendarArea = this.handleClickInCalendarArea.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutsideCalendarArea);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutsideCalendarArea);
    }

    componentWillReceiveProps(nextProps: CProps) {
        if (this.props.date && !this.props.date.isSame(nextProps.date as Mon.Moment)) {
            console.log('Calendar componentWillReceiveProps ' + nextProps.date);
            this.dispatcher.apply(new DataChanged(nextProps.date));
        }
    }

    render() {
        console.log('Calendar render state:%s props: %s', Object.keys(this.state), Object.keys(this.props));
        const currentDate = this.state.currentDateTime;
        const currentDateStr = DateTimeToString(currentDate);
        return (
            <div className="lmen-calendar" onClick={this.handleClickInCalendarArea}>
                <input
                    readOnly={true}
                    value={currentDateStr}
                    onClick={this.handleClickInInput}
                    onChange={this.handleChangeInInput}
                />
                <span className="fa fa-calendar" onClick={this.handleClickInInput} />
                {this.state.open ? <CalendarDropDown info={this.state} dispatcher={this.dispatcher} /> : false}
            </div>
        );
    }

    handleClickOutsideCalendarArea(evt: MouseEvent) {
        // tslint:disable-next-line:no-any
        let av = evt as any;
        if (this.state.open && av.calendarStamp !== this) {
            console.log('handleClickOutsideCalendarArea closing %s', av.calendarStamp !== undefined);
            this.dispatcher.apply(new CloseDropDownUserReectSelection());
        }
    }

    handleClickInCalendarArea(ev: React.MouseEvent<HTMLDivElement>) {
        console.log('im in the main div onclick putting a stamp on the event handler');

        // tslint:disable-next-line:no-any
        let av = ev.nativeEvent as any;
        av.calendarStamp = this;
    }

    handleClickInInput() {
        console.log('calendar input click');
        this.dispatcher.apply(new OpenDropDown());
    }

    handleChangeInInput() {
        // for not giving browser warning
        console.log('calendar click');
    }

    handleCalendarStateChange(newState: CalendarState, oldState: CalendarState): void {

        let beforeDate = oldState.currentDateTime;

        this.setState(
            (prevState, props) => {
                return newState;
            },
            () => {
                let newDate = newState.currentDateTime;
                console.log(
                    'hjkh %s %s %s',
                    newDate && newDate.date ? newDate.date.day : 'null',
                    beforeDate && beforeDate.date ? beforeDate.date.day : 'null',
                    newState.userEndSelection
                );

                if (newState.userEndSelection && areDateTimeDifferent(beforeDate, newDate)) {
                    let datetime = newDate ? convertDateTimeToMom(newDate) : null;
                    console.log('dateTime %s', datetime);

                    this.props.onDateChange(datetime);
                }
            }
        );

    }

}