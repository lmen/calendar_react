import * as React from 'react';
import * as Mon from 'moment';
import { MonthDays, localeListOfWeekDaysShort } from './redux/utils';
import { CalendarDDToolbar } from './toolbar';
import { Store } from './redux/dispatcher';
import {
    DayViewSelected, DayViewGotoPrevMonth,
    DayViewGotoNextMonth, ShowMonthsListView, ShowYearsListView
}
    from './redux/actions';

interface Props {
    day: number;
    currentMonth: boolean;
    sel: boolean;
    onSelectedDay?: (day: number) => void | undefined;
}

export class Day extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);

        this.handleSelectedDay = this.handleSelectedDay.bind(this);
    }

    cssClass() {
        if (this.props.sel) {
            return 'day-selected';
        }
        return this.props.currentMonth ? 'day' : 'day-inactive';
    }

    handleSelectedDay() {
        let callback = this.props.onSelectedDay;
        if (callback) {
            callback(this.props.day);
        }
    }

    shouldComponentUpdate(nextProps: Props, nestState: {}, nextContext: {}): boolean {
        let res = !(nextProps.day === this.props.day && nextProps.sel === this.props.sel);
        console.log(
            'CalendatDropDownDay shouldComponentUpdate=%s: %s == %s, %s == %s',
            res,
            nextProps.sel, this.props.sel,
            nextProps.day, this.props.day);

        return res;
    }

    render() {
        console.log('CalendarDropDownDay render day: %s props sel: %s', this.props.day, this.props.sel);
        return (
            <td
                className={this.cssClass()}
                onClick={this.handleSelectedDay}
            >
                {this.props.day}
            </td>
        );
    }

}

// =============================

interface PropsDays {
    displayDate: Mon.Moment;
    selectedDate: Mon.Moment | null;
    localeCode: string;
    dispatcher: Store;
}

export class CalendarDays extends React.PureComponent<PropsDays> {

    private dispatcher: Store;

    constructor(props: PropsDays) {
        super(props);
        this.dispatcher = this.props.dispatcher;

        this.handleSelectedDay = this.handleSelectedDay.bind(this);
        this.handleGoPrevMonth = this.handleGoPrevMonth.bind(this);
        this.handleGoNextMonth = this.handleGoNextMonth.bind(this);
        this.handleGoMonthsList = this.handleGoMonthsList.bind(this);
        this.handleGoYearsList = this.handleGoYearsList.bind(this);
    }

    render() {
        console.log('render DaySelectionView %s ', this.props.displayDate);
        const displayDate = this.props.displayDate;
        const dayToSelect = this.calculateSelDay(displayDate, this.props.selectedDate);
        const weekDaysAbr = localeListOfWeekDaysShort(this.props.localeCode);
        let monthDays = new MonthDays();
        monthDays.fillMonthDays(displayDate);
        return (
            <div className="view">
                <CalendarDDToolbar
                    localeCode={this.props.localeCode}
                    showBtns={true}
                    displayDate={displayDate}
                    onNext={this.handleGoNextMonth}
                    onPrev={this.handleGoPrevMonth}
                    onMonth={this.handleGoMonthsList}
                    onYear={this.handleGoYearsList}
                />
                <table className="daysView">
                    <thead>
                        <tr>
                            {weekDaysAbr.map((day, index) => (<td className="header" key={index}> {day} </td>))}
                        </tr>
                    </thead>
                    <tbody>
                        {monthDays.getMonthDays().map((week, index) =>
                            <tr key={index}>
                                {week.map((d, ind) =>
                                    <Day
                                        key={ind}
                                        day={d.day}
                                        currentMonth={d.currentMonth}
                                        sel={d.currentMonth && d.day === dayToSelect}
                                        onSelectedDay={d.currentMonth ? this.handleSelectedDay : undefined}
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
        this.props.dispatcher.apply(new DayViewSelected(day));
    }

    handleGoPrevMonth() {
        this.dispatcher.apply(new DayViewGotoPrevMonth());
    }

    handleGoNextMonth() {
        console.log('User click goto Next month');
        this.dispatcher.apply(new DayViewGotoNextMonth());
    }

    handleGoMonthsList() {
        this.dispatcher.apply(new ShowMonthsListView());
    }

    handleGoYearsList() {
        this.dispatcher.apply(new ShowYearsListView());
    }

    private calculateSelDay(displayDate: Mon.Moment, selectedDateByUser: Mon.Moment | null) {
        if (!selectedDateByUser) {
            return -1;
        }

        let selDay = -1, selyear = -1, selmonth = -1;
        selyear = selectedDateByUser.year();
        selmonth = selectedDateByUser.month();

        if (!(selmonth === displayDate.month() && selyear === displayDate.year())) {
            return -1;
        }
        selDay = selectedDateByUser.date();

        return selDay;
    }

}
