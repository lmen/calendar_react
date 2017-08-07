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

export function CalendarDropDownDay(props: Props) {

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

    // tslint:disable-next-line:no-console
    console.log('CalendarDropDownDay %s props sel: %s', props.dayinfo.day, props.sel);
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

interface PropsDays {
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarDays extends React.Component<PropsDays> {

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
