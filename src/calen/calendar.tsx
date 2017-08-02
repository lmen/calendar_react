import * as React from 'react';
import './calendar.css';
import { DayInfo, CalendarState, CalendarStateSubscriber, CalendarDispatcher, listToMatrix } from './data';
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
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarDropDown extends React.Component<CDDownProps> {

    private dispatcher: CalendarDispatcher;

    constructor(props: CDDownProps) {
        super(props);
        this.dispatcher = this.props.dispatcher;

        this.handleSelectedDay = this.handleSelectedDay.bind(this);
        this.handleGoPrevMonth = this.handleGoPrevMonth.bind(this);
        this.handleGoNextMonth = this.handleGoNextMonth.bind(this);
    }

    render() {
        const displayedMonthDesc = this.props.info.monthDesc[this.props.info.displayDate.month()];
        const displayedComp = this.props.info.displayDate.year();
        return (
            <div className="cdrop">
                <div className="zone">
                    <div className="one">
                        <span className="curMonth"> {displayedMonthDesc} </span>
                        <span className="curYear"> {displayedComp}</span>
                    </div>

                    <div className="buttons">
                        <span className="nextMonth" onClick={this.handleGoPrevMonth}> &lt; </span>
                        <span className="prevMonth" onClick={this.handleGoNextMonth}> &gt; </span>
                    </div>

                </div>
                <table className="daytable">
                    <thead>
                        <tr>
                            {weakDays.map((day, index) => (<td className="header" key={index}> {day} </td>))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.info.monthDays.getMonthDays().map((week, index) =>
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
            props.info.selectedDateByUser = props.info.displayDate.clone().day(day);
            props.info.monthDays.daySelected(props.info.selectedDateByUser);
        });
    }

    handleGoPrevMonth() {
        this.dispatcher.displayDateGoPrevMonthAction();
    }

    handleGoNextMonth() {
        this.dispatcher.displayDateGoNextMonthAction();
    }

}

// =============================

interface CMonthSelectProps {
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarMonthSelect extends React.Component<CMonthSelectProps> {

    private dispatcher: CalendarDispatcher;

    constructor(props: CDDownProps) {
        super(props);
        this.dispatcher = this.props.dispatcher;

        this.handleSelectedDay = this.handleSelectedDay.bind(this);
        this.handleGoPrevMonth = this.handleGoPrevMonth.bind(this);
        this.handleGoNextMonth = this.handleGoNextMonth.bind(this);
    }

    render() {        
        const displayedMonthDesc = this.props.info.monthDesc[this.props.info.displayDate.month()];
        const displayedComp = this.props.info.displayDate.year();
        const monthMatrix = listToMatrix(this.props.info.monthDesc, 4);
        return (
            <div className="cdrop">
                <div className="zone">
                    <div className="one">                        
                        <span className="curMonth"> {displayedMonthDesc} </span>
                        <span className="curYear"> {displayedComp}</span>
                    </div>

                    <div className="buttons">
                        <span className="nextMonth" onClick={this.handleGoPrevMonth}> &lt; </span>
                        <span className="prevMonth" onClick={this.handleGoNextMonth}> &gt; </span>
                    </div>

                </div>
                
                <table className="monthtable">
                    
                    <tbody>
                        {  monthMatrix.map((row, index) => 
                            <tr key={index}>
                                {row.map((d, ind) =>
                                    <td key={ind}>{d}</td>
                                )}
                            </tr>
                            )
                        }

                    </tbody>
                </table>
            </div>
        );

    }

    handleSelectedDay(day: number) {

        this.setState((state, props) => {
            props.info.selectedDateByUser = props.info.displayDate.clone().day(day);
            props.info.monthDays.daySelected(props.info.selectedDateByUser);
        });
    }

    handleGoPrevMonth() {
        this.dispatcher.displayDateGoPrevMonthAction();
    }

    handleGoNextMonth() {
        this.dispatcher.displayDateGoNextMonthAction();
    }

}

const weakDays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
const monthDesc = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export class Calendar extends React.Component<CProps, CalendarState> implements CalendarStateSubscriber {

    private dispatcher: CalendarDispatcher;

    constructor(props: CProps) {
        super(props);
        let displayDate = Mon({ year: 2017, month: 7 - 1, day: 20 });

        this.state = new CalendarState(weakDays, monthDesc, displayDate);
        this.dispatcher = new CalendarDispatcher(this, this.state);
        this.handleReset = this.handleReset.bind(this);

        this.dispatcher.displayDateChangeToNew(displayDate);
    }

    render() {
        return (
            <div>
                <input value="op" onClick={this.handleReset} onFocus={this.handleReset} />
                < CalendarDropDown info={this.state} dispatcher={this.dispatcher} />
                < CalendarMonthSelect info={this.state} dispatcher={this.dispatcher} />
            </div>
        );
    }

    handleReset() {
        // console.log('Focus');
    }

    handleCalendarStateChange(newState: CalendarState): void {
        this.setState((prevState) => {
            return newState;
        });
    }

}

interface CProps {

}
