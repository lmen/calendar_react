import * as React from 'react';
import './calendar.css';
import { DayInfo, CalendarState, CalendarStateSubscriber, CalendarDispatcher, listToMatrix } from './data';
import * as Mon from 'moment';

export interface CalendarDDSapoProps {
    showBtns: boolean;
    monthDesc: string[];
    displayDate: Mon.Moment;
    onPrev?: () => void;
    onNext?: () => void;
}

export class CalendarDDSapo extends React.Component<CalendarDDSapoProps> {

    renderBtns() {
        return (
            <div className="buttons">
                <span className="nextMonth" onClick={this.props.onPrev}> &lt; </span>
                <span className="prevMonth" onClick={this.props.onNext}> &gt; </span>
            </div>
        );
    }

    render() {
        const displayedMonthDesc = this.props.monthDesc[this.props.displayDate.month()];
        const displayedComp = this.props.displayDate.year();
        return (
            <div className="zone">
                <div className="one">
                    <span className="curMonth"> {displayedMonthDesc} </span>
                    <span className="curYear"> {displayedComp}</span>
                </div>

                {this.props.showBtns ? this.renderBtns() : false}

            </div>);
    }
}

// ================================

interface CDDownDayProps {
    dayinfo: DayInfo;
    selectedDay?: (day: number) => void | undefined;
    sel: boolean;
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
        if (this.props.sel) {
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
        const displayDate = this.props.info.displayDate;
        return (
            <div className="cdrop">
                <CalendarDDSapo
                    monthDesc={this.props.info.monthDesc}
                    showBtns={true}
                    displayDate={displayDate}
                    onNext={this.handleGoNextMonth}
                    onPrev={this.handleGoPrevMonth}
                />
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
                                    <CalendarDropDownDay
                                        key={ind}
                                        dayinfo={d}
                                        sel={this.isSelectedDay(displayDate, d)}
                                        selectedDay={d.currentMonth ? this.handleSelectedDay : undefined}
                                    />
                                )}
                            </tr>)
                        }

                    </tbody>

                </table>
            </div>
        );

    }

    handleSelectedDay(day: number) {

        this.props.dispatcher.daySelected(day);
    }

    handleGoPrevMonth() {
        this.dispatcher.displayDateGoPrevMonthAction();
    }

    handleGoNextMonth() {
        this.dispatcher.displayDateGoNextMonthAction();
    }

    private isSelectedDay(displayDate: Mon.Moment, dayInfo: DayInfo) {
        if (!dayInfo.currentMonth || !this.props.info.selectedDateByUser) {
            return false;
        }

        let selDay = -1, selyear = -1, selmonth = -1;
        selDay = this.props.info.selectedDateByUser.date();
        selyear = this.props.info.selectedDateByUser.year();
        selmonth = this.props.info.selectedDateByUser.month();

        return selDay === dayInfo.day && selmonth === displayDate.month() && selyear === displayDate.year();
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

        this.handleSelectedMonth = this.handleSelectedMonth.bind(this);
        this.handleGoPrevMonth = this.handleGoPrevMonth.bind(this);
        this.handleGoNextMonth = this.handleGoNextMonth.bind(this);
    }

    renderMonth(month: string, num: number, isSelected: boolean, onYearSelected: (month: number) => void) {
        function intonYearSelected() {
            onYearSelected(num);
        }
        const css = isSelected ? 'monthSelected' : '';
        return (<td key={month} onClick={intonYearSelected} className={css}>{month}</td>);
    }

    render() {
        const monthMatrix = listToMatrix(this.props.info.monthDesc, 4);
        return (
            <div className="cdrop">

                <CalendarDDSapo
                    monthDesc={this.props.info.monthDesc}
                    showBtns={false}
                    displayDate={this.props.info.displayDate}
                />

                <table className="monthtable">
                    <tbody>
                        {monthMatrix.map((row, index) =>
                            <tr key={index}>
                                {row.map((desc, ind) => {
                                    let monthNum = (index * 4) + ind;
                                    let selected = this.isToSelectedYear(monthNum);
                                    return this.renderMonth(desc, monthNum, selected, this.handleSelectedMonth);
                                })}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );

    }

    handleSelectedMonth(month: number) {

        this.dispatcher.monthSelected(month);
    }

    handleGoPrevMonth() {
        this.dispatcher.displayDateGoPrevMonthAction();
    }

    handleGoNextMonth() {
        this.dispatcher.displayDateGoNextMonthAction();
    }

    private isToSelectedYear(month: number): boolean {
        let monthSel = this.props.info.selectedDateByUser ? this.props.info.selectedDateByUser.month() : -1;
        return monthSel === month;
    }
}

// =============================

interface CYearSelectProps {
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarYearSelect extends React.Component<CYearSelectProps> {

    private dispatcher: CalendarDispatcher;

    constructor(props: CDDownProps) {
        super(props);
        this.dispatcher = this.props.dispatcher;

        this.handleSelectedYear = this.handleSelectedYear.bind(this);
        this.handleGoPrevMonth = this.handleGoPrevMonth.bind(this);
        this.handleGoNextMonth = this.handleGoNextMonth.bind(this);
    }

    renderYear(year: number, isSelected: boolean, onYearSelected: (year: number) => void) {
        function intonYearSelected() {
            onYearSelected(year);
        }
        const css = isSelected ? 'yearSelected' : '';
        return (<td key={year} onClick={intonYearSelected} className={css}>{year}</td>);
    }

    render() {
        const yearsMat = this.props.info.yearsViewPort.content();
        return (
            <div className="cdrop">
                <CalendarDDSapo
                    monthDesc={this.props.info.monthDesc}
                    showBtns={true}
                    displayDate={this.props.info.displayDate}
                    onNext={this.handleGoNextMonth}
                    onPrev={this.handleGoPrevMonth}
                />
                <table className="yeartable">

                    <tbody>
                        {yearsMat.map((row, index) =>
                            <tr key={index}>
                                {row.map((d, ind) =>
                                    this.renderYear(d, this.isSelectedYear(d), this.handleSelectedYear)
                                )}
                            </tr>
                        )
                        }

                    </tbody>
                </table>
            </div>
        );

    }

    handleSelectedYear(year: number) {
        this.dispatcher.yearSelected(year);
    }

    handleGoPrevMonth() {
        this.dispatcher.yearViewPortMoveUp();
    }

    handleGoNextMonth() {
        this.dispatcher.yearViewPortMoveDown();
    }

    private isSelectedYear(year: number) {
        let yearSel = this.props.info.selectedDateByUser ? this.props.info.selectedDateByUser.year() : -1;
        return year === yearSel;
    }

}

// ==============
interface CProps {

}

const weakDays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
const monthDesc = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export class Calendar extends React.Component<CProps, CalendarState> implements CalendarStateSubscriber {

    private dispatcher: CalendarDispatcher;

    constructor(props: CProps) {
        super(props);
        let currDate = Mon({ year: 2017, month: 7 - 1, day: 20 });

        this.state = new CalendarState(weakDays, monthDesc, currDate);
        this.dispatcher = new CalendarDispatcher(this, this.state);
        this.handleReset = this.handleReset.bind(this);

        this.dispatcher.init(currDate);
    }

    render() {
        return (
            <div>
                <input value="op" onClick={this.handleReset} onFocus={this.handleReset} />
                < CalendarDropDown info={this.state} dispatcher={this.dispatcher} />
                < CalendarMonthSelect info={this.state} dispatcher={this.dispatcher} />
                < CalendarYearSelect info={this.state} dispatcher={this.dispatcher} />
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
