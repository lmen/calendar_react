import * as React from 'react';
import './calendar.css';
import { MonthDays, DayInfo } from './data';
import * as Mon from 'moment';



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

// =============================

interface CDDownProps {
    showDate: Mon.Moment;
    selectedDate?: Mon.Moment;
    curDay?: number;
    selectedDay?: (day: number) => void;
}

interface CDDownState {
    displayDate: Mon.Moment;
    selectedDate?: Mon.Moment;
    monthDays: MonthDays;
}

export class CalendarDropDown extends React.Component<CDDownProps, CDDownState> {

    constructor(props: CDDownProps) {
        super(props);
        this.state = {
            displayDate: props.showDate.clone().day(1).startOf('hour'),
            selectedDate: props.selectedDate,
            monthDays: new MonthDays()
        };
        this.state.monthDays.fillMonthDays(this.state.displayDate);
        this.handleSelectedDay = this.handleSelectedDay.bind(this);
        this.handleGoPrevMonth = this.handleGoPrevMonth.bind(this);
        this.handleGoNextMonth = this.handleGoNextMonth.bind(this);
    }

    render() {

        const weakDays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
        const monthDesc = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
            'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        return (
            <div className="cdrop">
                <div>
                    <span > {this.state.displayDate.format()} </span>
                    <span className="curMonth"> {monthDesc[this.state.displayDate.month()]} </span>
                    <span className="curYear"> {this.state.displayDate.year()}</span>
                    <span className="nextMonth" onClick={this.handleGoPrevMonth}> &lt; </span>
                    <span className="prevMonth" onClick={this.handleGoNextMonth}> &gt; </span>
                </div>
                <table className="daytable">
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
            state.selectedDate = state.displayDate.clone().day(day);
            state.monthDays.daySelected(state.selectedDate);
        });
    }

    handleGoPrevMonth() {
        this.setState((prevState: CDDownState) => {
            prevState.displayDate = prevState.displayDate.clone().subtract(1, 'M');
            prevState.monthDays.fillMonthDays(prevState.displayDate);
        });
    }

    handleGoNextMonth() {
        this.setState((prevState: CDDownState) => {
            prevState.displayDate = prevState.displayDate.clone().add(1, 'M');
            prevState.monthDays.fillMonthDays(prevState.displayDate);
        });
    }

}

export class Calendar extends React.Component<CProps> {

    constructor(props: CProps) {
        super(props);
        this.onReset = this.onReset.bind(this);
    }

    render() {
        const date = Mon({ year: 2017, month: 7 - 1, day: 20 });
        return (
            <div>
                <input value="op" onClick={this.onReset} onFocus={this.onReset} />
                < CalendarDropDown showDate={date} />
            </div>
        );
    }

    onReset() {
        console.log('Focus');
    }
}

interface CProps {

}