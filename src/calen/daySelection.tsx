import * as React from 'react';
import * as Mon from 'moment';
import { CalendarState } from './redux/state';
import { DayInfo } from './redux/utils';
import { CalendarDDToolbar } from './toolbar';
import { CalendarDispatcher } from './redux/dispatcher';
import { WEAK_DAYS } from './redux/locale';

interface Props {
    dayinfo: DayInfo;
    selectedDay?: (day: number) => void | undefined;
    sel: boolean;
}

export class CalendarDropDownDay extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        this.handleSelectedDay = this.handleSelectedDay.bind(this);
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

    render() {
        console.log('CalendarDropDownDay %s props sel: %s', this.props.dayinfo.day, this.props.sel);
        return (
            <td
                className={this.cssClass()}
                onClick={this.handleSelectedDay}
            >
                {this.props.dayinfo.day}
            </td>
        );
    }

}

// =============================

interface PropsDays {
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarDays extends React.PureComponent<PropsDays> {

    private dispatcher: CalendarDispatcher;

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
        // tslint:disable-next-line:no-console
        console.log('render DaySelectionView %s ', this.props.info.displayDate);
        const displayDate = this.props.info.displayDate;
        const dayToSelect = this.calculateSelDay(displayDate, this.props.info.selectedDateByUser);
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
                            {WEAK_DAYS.map((day, index) => (<td className="header" key={index}> {day} </td>))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.info.monthDays.getMonthDays().map((week, index) =>
                            <tr key={index}>
                                {week.map((d, ind) =>
                                    <CalendarDropDownDay
                                        key={ind}
                                        dayinfo={d}
                                        sel={d.currentMonth && d.day === dayToSelect}
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
        this.props.dispatcher.dayViewSelected(day);
    }

    handleGoPrevMonth() {
        this.dispatcher.dayViewGotoPrevMonth();
    }

    handleGoNextMonth() {
        this.dispatcher.dayViewGotoNextMonth();
    }

    handleGoMonthsList() {
        this.dispatcher.showMonthsListView();
    }

    handleGoYearsList() {
        this.dispatcher.showYearsListView();
    }

    private calculateSelDay(displayDate: Mon.Moment, selectedDateByUser: Mon.Moment) {
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
