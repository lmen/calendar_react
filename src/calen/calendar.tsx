import * as React from 'react';
import './calendar.css';
import * as Mon from 'moment';
import { CalendarDropDown } from './dropDown';
import { CalendarState } from './redux/state';
import { CalendarStateSubscriber, Store, } from './redux/dispatcher';

interface CProps {
    date: Mon.Moment;
    onDateChange: (newDate: Mon.Moment) => void;
}

export class Calendar extends React.PureComponent<CProps, CalendarState> implements CalendarStateSubscriber {

    private dispatcher: Store;

    constructor(props: CProps) {
        super(props);

        let currDate = this.props.date;

        this.dispatcher = new Store(currDate, this);

        this.state = this.dispatcher.getCurrentState();

        this.handleChange = this.handleChange.bind(this);

        console.log(
            'Calender componentDidMount initial state: sel: %s display: %s',
            this.state.selectedDateByUser,
            this.state.displayDate);

    }

    shouldComponentUpdate(nextProps: CProps, nextState: CalendarState, nextContext: {}): boolean {
        let res = !(this.props.date === nextProps.date &&
            this.state.currentView === nextState.currentView &&
            this.state.displayDate === nextState.displayDate &&
            this.state.selectedDateByUser === nextState.selectedDateByUser
        );
        console.log(
            'Calender shouldComponentUpdate:=%s %s==%s display: %s==%s', res,
            this.state.selectedDateByUser, nextState.selectedDateByUser,
            this.state.displayDate, nextState.displayDate);

        return res;
    }

    render() {
        console.log('Calendar render state:%s props: %s', Object.keys(this.state), Object.keys(this.props));
        return (
            <div>
                <input
                    value={this.state.selectedDateByUser.format()}
                    onChange={this.handleChange}
                />
                <CalendarDropDown info={this.state} dispatcher={this.dispatcher} />
            </div>
        );
    }

    handleChange() {
        console.log('handle change from input: %s', this.state.selectedDateByUser);
    }

    handleCalendarStateChange(newState: CalendarState): void {
        let beforeDate = this.dispatcher.getCurrentState().selectedDateByUser;

        this.setState(
            (prevState, props) => {
                console.log(
                    'handle dispatcher change: ' +
                    'newState.selDate: %s newState.displayDate: %s' +
                    'prevState.selDate: %s prevState.displayDate: %s',
                    newState.selectedDateByUser, newState.displayDate,
                    prevState.selectedDateByUser, prevState.displayDate);
                return newState;
            },
            () => {
                let newDate = newState.selectedDateByUser;
                if (diff(beforeDate, newDate)) {
                    this.props.onDateChange(newDate);
                }
            }
        );
    }

}

function diff(a: Mon.Moment, b: Mon.Moment): boolean {
    if (a != null) {
        return a.isSame(b);
    }
    return b != null;
}