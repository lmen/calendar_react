import * as React from 'react';
import * as Mon from 'moment';
import { CalendarDropDown } from './dropDown';
import { CalendarState } from './redux/state';
import { CalendarStateSubscriber, Store, } from './redux/dispatcher';
import { DataChanged, OpenDropDown } from './redux/actions';

interface CProps {
    date: Mon.Moment;
    onDateChange: (newDate: Mon.Moment | null) => void;
}

export class Calendar extends React.PureComponent<CProps, CalendarState> implements CalendarStateSubscriber {

    private dispatcher: Store;

    constructor(props: CProps) {
        super(props);

        let currDate = this.props.date;

        this.dispatcher = new Store(currDate, this);

        this.state = this.dispatcher.getCurrentState();

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);

        console.log(
            'Calender componentDidMount initial state: sel: %s display: %s',
            this.state.selectedDateByUser,
            this.state.displayDate);
    }

    componentWillReceiveProps(nextProps: CProps) {
        if (this.props.date && !this.props.date.isSame(nextProps.date)) {
            console.log('Calendar componentWillReceiveProps ' + nextProps.date);
            this.dispatcher.apply(new DataChanged(nextProps.date));
        }
    }
    /*
        shouldComponentUpdate(nextProps: CProps, nextState: CalendarState, nextContext: {}): boolean {
            let res = !(this.props.date === nextProps.date &&
                this.state.currentView === nextState.currentView &&
                this.state.displayDate === nextState.displayDate &&
                this.state.selectedDateByUser === nextState.selectedDateByUser 
    
            );
            console.log(
                'Calender shouldComponentUpdate:=%s ' +
                ' props: %s == %s ' +
                'selectDate: %s==%s display: %s==%s',
                res,
                this.props.date, nextProps.date,
                this.state.selectedDateByUser, nextState.selectedDateByUser,
                this.state.displayDate, nextState.displayDate);
    
            return res;
        }
        */

    render() {
        console.log('Calendar render state:%s props: %s', Object.keys(this.state), Object.keys(this.props));
        const currentDate = this.state.currentDate;
        const currentDateStr = currentDate ? currentDate.format() : '';
        return (
            <div className="lmen-calendar">
                <input
                    value={currentDateStr}
                    onClick={this.handleClick}
                    onChange={this.handleChange}
                />
                {this.state.open ? <CalendarDropDown info={this.state} dispatcher={this.dispatcher} /> : false}
            </div>
        );
    }

    handleClick() {
        console.log('calendar click');

        this.dispatcher.apply(new OpenDropDown());
    }

    handleChange() {
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
                if (newState.userEndSelection && diff(beforeDate, newDate)) {

                    this.props.onDateChange(newDate);
                }
            }
        );
    }

}

function diff(a: Mon.Moment | null, b: Mon.Moment | null): boolean {
    if (a != null && b != null) {
        return a.isSame(b);
    }
    return b !== a;
}