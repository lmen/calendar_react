import * as React from 'react';
import { Calendar, Config } from './calen/calendar';
import * as Mom from 'moment';
import 'moment/locale/pt';

const CalendarConfig: Config = {
    localeCode: 'pt'
};

const CalendarConfigTime: Config = {
    localeCode: 'pt',
    workingMode: 'time'
};

const CalendarConfigDate: Config = {
    localeCode: 'pt',
    workingMode: 'date'
};

export class Form extends React.Component<{}, {
    transferDate: Mom.Moment | null;
    transferDateTime: Mom.Moment | null;
    transferDateDate: Mom.Moment | null;
}> {

    constructor(props: {}) {
        super(props);
        this.state = {
            transferDate: Mom(),
            transferDateTime: null,
            transferDateDate: null
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handlePlusYear = this.handlePlusYear.bind(this);
        this.handleToNull = this.handleToNull.bind(this);
    }

    render() {
        const d = this.state.transferDate;
        const date = d ? d.format() : 'Its null';
        return (
            <div>
                <div> TransfereDate: {date} </div>
                <button onClick={this.handlePlusYear}>Plus one year</button>
                <button onClick={this.handleToNull}>To null</button>
                <Calendar
                    config={CalendarConfig}
                    date={this.state.transferDate}
                    onDateChange={this.handleDateChange}
                />
                <Calendar
                    config={CalendarConfigTime}
                    date={this.state.transferDateTime}
                    onDateChange={this.handleDateChange}
                />
                <Calendar
                    config={CalendarConfigDate}
                    date={this.state.transferDateDate}
                    onDateChange={this.handleDateChange}
                />
            </div>
        );
    }

    public handleToNull(): void {
        this.setState((prevState) => {
            let transferDate = null;
            return { transferDate };
        });
    }

    handlePlusYear() {
        this.setState((prevState) => {
            if (prevState.transferDate) {
                let transferDate = prevState.transferDate.clone();
                transferDate.add(1, 'year');
                return { transferDate };
            }
            return prevState;
        });
    }

    handleDateChange(newDate: Mom.Moment) {

        console.log('insider Form: %s', newDate ? newDate.format() : 'null');

        this.setState(() => { return { transferDate: newDate }; });
    }

}