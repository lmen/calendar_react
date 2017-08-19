import * as React from 'react';
import * as Mon from 'moment';
import { CalendarDropDown } from './dropDown';
import { CalendarState } from './redux/state';
import { CalendarStateSubscriber, Store, } from './redux/dispatcher';
import { DataChanged, OpenDropDown, InitState, CloseDropDownUserReectSelection } from './redux/actions';

export interface Config {
    locale_code: string;
}

interface CProps {
    date: Mon.Moment;
    config: Config;
    onDateChange: (newDate: Mon.Moment | null) => void;
}

export class Calendar extends React.PureComponent<CProps, CalendarState> implements CalendarStateSubscriber {

    private dispatcher: Store;

    constructor(props: CProps) {
        super(props);

        let currDate = this.props.date;

        this.dispatcher = new Store(new InitState(currDate, props.config), this);

        this.state = this.dispatcher.getCurrentState();

        this.handleClickInInput = this.handleClickInInput.bind(this);
        this.handleChangeInInput = this.handleChangeInInput.bind(this);
        this.handleClickOutsideCalendarArea = this.handleClickOutsideCalendarArea.bind(this);
        this.handleClickInCalendarArea = this.handleClickInCalendarArea.bind(this);

        console.log(
            'Calender componentDidMount initial state: sel: %s display: %s',
            this.state.selectedDateByUser,
            this.state.displayDate);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutsideCalendarArea);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutsideCalendarArea);
    }

    componentWillReceiveProps(nextProps: CProps) {
        if (this.props.date && !this.props.date.isSame(nextProps.date)) {
            console.log('Calendar componentWillReceiveProps ' + nextProps.date);
            this.dispatcher.apply(new DataChanged(nextProps.date));
        }
    }

    render() {
        console.log('Calendar render state:%s props: %s', Object.keys(this.state), Object.keys(this.props));
        const currentDate = this.state.currentDate;
        const currentDateStr = currentDate ? currentDate.format() : '';
        return (
            <div className="lmen-calendar" onClick={this.handleClickInCalendarArea}>
                <input
                    value={currentDateStr}
                    onClick={this.handleClickInInput}
                    onChange={this.handleChangeInInput}
                />
                {this.state.open ? <CalendarDropDown info={this.state} dispatcher={this.dispatcher} /> : false}
            </div>
        );
    }

    handleClickOutsideCalendarArea(evt: MouseEvent) {
        // tslint:disable-next-line:no-any
        let av = evt as any;
        console.log('handleClickOutsideCalendarArea %s', av.calendarStamp);
        if (av.calendarStamp && av.calendarStamp !== this) {
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

    handleCalendarStateChange(newState: CalendarState): void {
        let beforeDate = this.dispatcher.getCurrentState().selectedDateByUser;

        this.setState(
            (prevState, props) => {
                console.log(
                    'handle dispatcher change: ' +
                    'newState.selDate: %s newState.displayDate: %s' +
                    'prevState.selDate: %s prevState.displayDate: %s',
                    'userEndSelection: %s ',
                    newState.selectedDateByUser, newState.displayDate,
                    prevState.selectedDateByUser, prevState.displayDate,
                    newState.userEndSelection);
                return newState;
            },
            () => {
                let newDate = newState.selectedDateByUser;
                if (newState.userEndSelection && areMomentsDifferent(beforeDate, newDate)) {

                    this.props.onDateChange(newDate);
                }
            }
        );
    }

}

function areMomentsDifferent(a: Mon.Moment | null, b: Mon.Moment | null): boolean {
    if (a !== null && b !== null) {
        return a.isSame(b);
    }
    return b !== a;
}