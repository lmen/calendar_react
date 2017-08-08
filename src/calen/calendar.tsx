import * as React from 'react';
import './calendar.css';
import * as Mon from 'moment';
import { CalendarDropDown } from './dropDown';
import { CalendarState } from './redux/state';
import { CalendarStateSubscriber, CalendarDispatcher } from './redux/dispatcher';
import { WEAK_DAYS, MONTH_DESC } from './redux/locale';

interface CProps {
    date: Mon.Moment;
    onDateChange: (newDate: Mon.Moment) => void;
}

export class Calendar extends React.Component<CProps, CalendarState> implements CalendarStateSubscriber {

    private dispatcher: CalendarDispatcher;

    constructor(props: CProps) {
        super(props);

        let currDate = this.props.date;

        this.state = new CalendarState(WEAK_DAYS, MONTH_DESC, currDate);
        this.dispatcher = new CalendarDispatcher(this, this.state);
        this.handleChange = this.handleChange.bind(this);

        this.dispatcher.init(currDate);
    }

    render() {
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
        console.log('handle change: %s', this.state.selectedDateByUser);
    }

    handleCalendarStateChange(newState: CalendarState): void {
        this.setState((prevState, props) => {
            // tslint:disable-next-line:no-console
            console.log('handle change2: %s', this.state.selectedDateByUser);
            // props.onDateChange(this.state.selectedDateByUser);
            return newState;
        });
    }

}
