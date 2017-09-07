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
    transferDateTime: Mom.Moment | null;
    transferTime: Mom.Moment | null;
    transferDate: Mom.Moment | null;
}> {

    constructor(props: {}) {
        super(props);
        this.state = {
            transferDateTime: Mom(),
            transferTime: null,
            transferDate: null
        };
        this.handleDateChangeDateTime = this.handleDateChangeDateTime.bind(this);
        this.handleDateChangeTime = this.handleDateChangeTime.bind(this);
        this.handleDateChangeDate = this.handleDateChangeDate.bind(this);
        this.handlePlusYear = this.handlePlusYear.bind(this);
        this.handleToNull = this.handleToNull.bind(this);
    }

    render() {

        return (
            <div>
                <div> TransfereDate: {momtoString(this.state.transferDateTime)} </div>
                <button onClick={this.handlePlusYear}>Plus one year</button>
                <button onClick={this.handleToNull}>To null</button>
                <Calendar
                    config={CalendarConfig}
                    date={this.state.transferDateTime}
                    onDateChange={this.handleDateChangeDateTime}
                />

                <div> TransfereDate: {momtoString(this.state.transferTime)} </div>
                <Calendar
                    config={CalendarConfigTime}
                    date={this.state.transferTime}
                    onDateChange={this.handleDateChangeTime}
                />

                <div> TransfereDate: {momtoString(this.state.transferDate)} </div>
                <Calendar
                    config={CalendarConfigDate}
                    date={this.state.transferDate}
                    onDateChange={this.handleDateChangeDate}
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

    handleDateChangeDateTime(newDate: Mom.Moment) {

        console.log('insider DateTime Form: %s', newDate ? newDate.format() : 'null');

        this.setState(() => { return { transferDateTime: newDate }; });
    }

    handleDateChangeTime(newDate: Mom.Moment) {

        console.log('insider just Time Form: %s', newDate ? newDate.format() : 'null');

        this.setState(() => { return { transferTime: newDate }; });
    }

    handleDateChangeDate(newDate: Mom.Moment) {

        console.log('insider just Date Form: %s', newDate ? newDate.format() : 'null');

        this.setState(() => { return { transferDate: newDate }; });
    }

}

function momtoString(d: Mom.Moment | null): string {
    return d ? d.format() : 'Its null';
}