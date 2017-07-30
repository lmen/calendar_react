import * as React from 'react';
import './calendar.css';
import { MonthDays, DayInfo } from './data';

interface CDDownProps {
    curYear: number;
    curMonth: number;
    curDay?: number;
    selectedDay?: (day: number) => void;
}

interface CDDownState {
    monthDays: MonthDays;
}

interface CDDownDayProps {
    dayinfo: DayInfo;
    selectedDay?: (day: number) => void;
}

export class CalendarDropDownDay extends React.Component<CDDownDayProps> {

    constructor(props: CDDownDayProps) {
        super(props);
        this.handleSelectedDay = this.handleSelectedDay.bind(this);
    }

    render() {
        return (
            // tslint:disable-next-line:max-line-length
            <td className={this.cssClass()} onClick={this.handleSelectedDay}> {this.props.dayinfo.day}
            </td>);
    }

    cssClass() {
        if (this.props.dayinfo.selected) {
            return 'day-selected';
        }
        return this.props.dayinfo.currentMonth ? 'day' : 'day-inactive';
    }

    handleSelectedDay() {
        let callback = this.props.selectedDay;
        if (callback) {
            callback(this.props.dayinfo.day);
        }
    }
}

export class CalendarDropDown extends React.Component<CDDownProps, CDDownState> {

    constructor(props: CDDownProps) {
        super(props);
        this.state = {
            monthDays: new MonthDays()
        };
        this.state.monthDays.fillMonthDays(props.curYear, props.curMonth);
        this.handleSelectedDay = this.handleSelectedDay.bind(this);
    }

    render() {

        const weakDays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];

        return (
            <div className="cdrop">
                <table className="">
                    <thead>
                        <tr>
                            {weakDays.map((day, index) => (<td className="header" key={index}> {day} </td>))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.monthDays.getMonthDays().map((week, index) =>
                            <tr key={index}>
                                {week.map((d, ind) =>
                                    // tslint:disable-next-line:max-line-length
                                    <CalendarDropDownDay key={ind} dayinfo={d} selectedDay={this.handleSelectedDay} />
                                )}
                            </tr>)
                        }

                    </tbody>

                </table>
            </div>
        );

    }

    handleSelectedDay(day: number) {
        this.setState((state, props) => {
            state.monthDays.daySelected(day);
        });
    }

}

export class Calendar extends React.Component<CProps> {

    constructor(props: CProps) {
        super(props);
        this.onReset = this.onReset.bind(this);
    }

    render() {
        return (
            <div>
                <input value="op" onClick={this.onReset} onFocus={this.onReset} />
                < CalendarDropDown curYear={2017} curMonth={3} />
            </div>
        );
    }

    onReset() {
        console.log('Focus');
    }
}

interface CProps {

}