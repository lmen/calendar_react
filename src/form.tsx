import * as React from 'react';
import { Calendar } from './calen/calendar';
import * as Mom from 'moment';

export class Form extends React.Component<{}, {
    transferDate: Mom.Moment;
}> {

    constructor(props: {}) {
        super(props);
        this.state = {
            transferDate: Mom()
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handlePlusYear = this.handlePlusYear.bind(this);
    }

    render() {
        const date = this.state.transferDate.format();
        return (
            <div>
                <div> TransfereDate: {date} </div>
                <button onClick={this.handlePlusYear}>Plus one year</button>
                <Calendar
                    date={this.state.transferDate}
                    onDateChange={this.handleDateChange}
                />
            </div>
        );
    }

    handlePlusYear() {
        this.setState((prevState) => {
            let transferDate = prevState.transferDate.clone();
            transferDate.add(1, 'year');
            return { transferDate };
        });
    }

    handleDateChange(newDate: Mom.Moment) {
        // tslint:disable-next-line:no-console
        console.log('insider Form: %s', newDate.format());

        this.setState(() => { return { transferDate: newDate }; });
    }

}