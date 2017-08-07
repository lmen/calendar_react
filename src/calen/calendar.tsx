import * as React from 'react';
import './calendar.css';
import { DayInfo, CalendarState, CalendarStateSubscriber, CalendarDispatcher, listToMatrix, VIEW } from './data';
import * as Mon from 'moment';

export class CalendarDDToolbar extends React.Component<{
    showBtns: boolean;
    monthDesc: string[];
    displayDate: Mon.Moment;
    onPrev?: () => void;
    onNext?: () => void;
    onBack?: () => void;
    onMonth?: () => void;
    onYear?: () => void;
}> {

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
                    <span className="curMonth" onClick={this.props.onMonth} > {displayedMonthDesc} </span>
                    <span className="curYear" onClick={this.props.onYear}> {displayedComp}</span>
                </div>

                {this.props.onBack ? <span className="back" onClick={this.props.onBack}> * </span> : false}
                {this.props.showBtns ? this.renderBtns() : false}

            </div>);
    }
}

// ================================

export function CalendarDropDownDay(props: {
    dayinfo: DayInfo;
    selectedDay?: (day: number) => void | undefined;
    sel: boolean;
}) {

    function cssClass() {
        if (props.sel) {
            return 'day-selected';
        }
        return props.dayinfo.currentMonth ? 'day' : 'day-inactive';
    }

    function handleSelectedDay() {
        let callback = props.selectedDay;
        if (callback) {
            callback(props.dayinfo.day);
        }
    }

    return (
        <td
            className={cssClass()}
            onClick={handleSelectedDay}
        >
            {props.dayinfo.day}
        </td>
    );

}

// =============================

interface CDDownProps {
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarDays extends React.Component<CDDownProps> {

    private dispatcher: CalendarDispatcher;

    constructor(props: CDDownProps) {
        super(props);
        this.dispatcher = this.props.dispatcher;

        this.handleSelectedDay = this.handleSelectedDay.bind(this);
        this.handleGoPrevMonth = this.handleGoPrevMonth.bind(this);
        this.handleGoNextMonth = this.handleGoNextMonth.bind(this);
        this.handleGoMonthsList = this.handleGoMonthsList.bind(this);
        this.handleGoYearsList = this.handleGoYearsList.bind(this);
    }

    render() {
        const displayDate = this.props.info.displayDate;
        return (
            <div className="cdrop">
                <CalendarDDToolbar
                    monthDesc={this.props.info.monthDesc}
                    showBtns={true}
                    displayDate={displayDate}
                    onNext={this.handleGoNextMonth}
                    onPrev={this.handleGoPrevMonth}
                    onMonth={this.handleGoMonthsList}
                    onYear={this.handleGoYearsList}
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

    handleGoMonthsList() {
        this.dispatcher.showMonthsList();
    }

    handleGoYearsList() {
        this.dispatcher.showYearsList();
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
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleGoYearsList = this.handleGoYearsList.bind(this);
    }

    renderMonth(month: string, num: number, isSelected: boolean, onYearSelected: (month: number) => void) {
        function handleYearSelected() {
            onYearSelected(num);
        }
        const css = isSelected ? 'monthSelected' : '';
        return (<td key={month} onClick={handleYearSelected} className={css}>{month}</td>);
    }

    render() {
        const monthMatrix = listToMatrix(this.props.info.monthDesc, 4);
        return (
            <div className="cdrop">

                <CalendarDDToolbar
                    monthDesc={this.props.info.monthDesc}
                    showBtns={false}
                    displayDate={this.props.info.displayDate}
                    onBack={this.handleGoBack}
                    onYear={this.handleGoYearsList}
                />

                <table className="monthtable">
                    <tbody>
                        {monthMatrix.map((row, index) =>
                            <tr key={index}>
                                {row.map((desc, ind) => {
                                    let monthNum = (index * 4) + ind;
                                    let selected = this.isToSelectedMonth(monthNum);
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

    handleGoBack() {
        this.dispatcher.showDays();
    }

    handleGoYearsList() {
        this.dispatcher.showYearsList();
    }

    private isToSelectedMonth(month: number): boolean {
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
        this.handleScrollUp = this.handleScrollUp.bind(this);
        this.handleScrollDown = this.handleScrollDown.bind(this);
        this.handleGoDaysList = this.handleGoDaysList.bind(this);
        this.handleGoMonthsList = this.handleGoMonthsList.bind(this);
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
                <CalendarDDToolbar
                    monthDesc={this.props.info.monthDesc}
                    showBtns={true}
                    displayDate={this.props.info.displayDate}
                    onNext={this.handleScrollDown}
                    onPrev={this.handleScrollUp}
                    onBack={this.handleGoDaysList}
                    onMonth={this.handleGoMonthsList}
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

    handleScrollUp() {
        this.dispatcher.yearViewPortMoveUp();
    }

    handleScrollDown() {
        this.dispatcher.yearViewPortMoveDown();
    }

    handleGoDaysList() {
        this.dispatcher.showDays();
    }

    handleGoMonthsList() {
        this.dispatcher.showMonthsList();
    }

    private isSelectedYear(year: number) {
        let yearSel = this.props.info.selectedDateByUser ? this.props.info.selectedDateByUser.year() : -1;
        return year === yearSel;
    }

}

// ==================
interface CDDownProps {
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarDropDown extends React.Component<CDDownProps> {

    renderDays() {
        return (
            < CalendarDays info={this.props.info} dispatcher={this.props.dispatcher} />
        );
    }

    renderMonthsList() {
        return (
            < CalendarMonthSelect info={this.props.info} dispatcher={this.props.dispatcher} />
        );
    }

    rendersYearsList() {
        return (
            < CalendarYearSelect info={this.props.info} dispatcher={this.props.dispatcher} />
        );
    }

    render() {
        const view = this.props.info.currentView;
        return ((view === VIEW.DAY ? this.renderDays() :
            (view === VIEW.MONTH_LIST ? this.renderMonthsList() : this.rendersYearsList()))
        );
    }

}

// ==============
interface CProps {
    date: Mon.Moment;
    onDateChange: (newDate: Mon.Moment) => void;
}

const weakDays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
const monthDesc = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export class Calendar extends React.Component<CProps, CalendarState> implements CalendarStateSubscriber {

    private dispatcher: CalendarDispatcher;

    constructor(props: CProps) {
        super(props);

        let currDate = this.props.date;

        this.state = new CalendarState(weakDays, monthDesc, currDate);
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
            console.log('handle change2: %s', this.state.selectedDateByUser);
            props.onDateChange(this.state.selectedDateByUser);
            return newState;
        });
    }

}
