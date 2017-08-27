import { CalendarState, VIEW, TimeSelectionState, Time } from './state';
import {
    ViewPort, TimeUtils
} from './utils';
import * as Mom from 'moment';
import { Config } from '../calendar';

export interface Action {
    reduce(state: CalendarState): CalendarState;
}

export interface InitialState {
    build(): CalendarState;
}

function convertMomToTime(mom: Mom.Moment, hasAmPm: boolean, withSeconds: boolean): Time {
    let time = new Time();

    time.hour = mom.hours();
    if (hasAmPm) {
        let p = new TimeUtils().toAMPmFormat(time.hour);
        time.isAm = p.isAm;
    }
    time.min = mom.minutes();
    if (withSeconds) {
        time.sec = mom.seconds();
    }

    time.timeZone = 'LISBON'; // to be defined later

    return time;
}

export class InitState implements InitialState {

    constructor(private currentDate: Mom.Moment, private config: Config) {

    }

    build(): CalendarState {
        let oldState = new CalendarState();

        oldState.config = Object.assign({}, this.config || { locale_code: 'en' });
        oldState.open = false;
        oldState.currentView = VIEW.DAY;
        oldState.userEndSelection = false;

        oldState.currentDate = this.currentDate ? this.currentDate.clone() : null;
        let date = this.currentDate || Mom.now();
        oldState.displayDate = date.clone().date(1);
        oldState.selectedDateByUser = date;

        let timeSel = new TimeSelectionState();
        let mode24Hours = false;
        timeSel.mode24Hours = mode24Hours; // it should depend from the locale config
        timeSel.showSeconds = true;
        timeSel.showTimeZone = true;
        let time = convertMomToTime(date, !timeSel.mode24Hours, timeSel.showSeconds);
        timeSel.timeDisplayed = time;

        oldState.timeSelection = timeSel;

        return oldState;
    }
}

export class DayViewGotoPrevMonth implements Action {

    public reduce(state: CalendarState): CalendarState {
        let newDisplayDate = state.displayDate.clone().subtract(1, 'M');

        return { ...state, displayDate: newDisplayDate };
    }
}

export class DayViewGotoNextMonth implements Action {

    public reduce(state: CalendarState): CalendarState {
        let newDisplayDate = state.displayDate.clone().add(1, 'M');

        return { ...state, displayDate: newDisplayDate };
    }

}

export class YearViewPortMoveUp implements Action {

    public reduce(state: CalendarState): CalendarState {
        let vp = new ViewPort(state.yearStartLine);
        vp.moveup();

        let yearStartLine = vp.getStartLine();

        return { ...state, yearStartLine };
    }
}

export class YearViewPortMoveDown implements Action {

    public reduce(state: CalendarState): CalendarState {
        let vp = new ViewPort(state.yearStartLine);
        vp.moveDown();

        let yearStartLine = vp.getStartLine();

        return { ...state, yearStartLine };
    }
}

export class YearViewSelected implements Action {

    constructor(private newYear: number) {

    }

    public reduce(state: CalendarState): CalendarState {

        const newDisplayDate = state.displayDate.clone().year(this.newYear);
        if (!newDisplayDate.isValid()) {
            console.log('invalid date: %s', this.newYear);
            return state;
        }

        let currentView = VIEW.DAY;
        let displayDate = newDisplayDate;

        return { ...state, currentView, displayDate };
    }
}

export class MonthViewSelected implements Action {

    constructor(private newMonth: number) {

    }

    public reduce(state: CalendarState): CalendarState {
        console.log('>> %s', this.newMonth);

        const newDisplayDate = state.displayDate.clone().month(this.newMonth);
        if (!newDisplayDate.isValid()) {
            return state;
        }

        let currentView = VIEW.DAY;
        let displayDate = newDisplayDate;

        return { ...state, currentView, displayDate };
    }
}

export class DayViewSelected implements Action {

    constructor(private day: number) {

    }

    public reduce(state: CalendarState): CalendarState {

        console.log('>> %s', this.day);

        const newDisplayDate = state.displayDate.clone().date(this.day);
        if (!newDisplayDate.isValid()) {
            return state;
        }

        return { ...state, selectedDateByUser: newDisplayDate };
    }
}

export class ShowDaysView implements Action {

    public reduce(state: CalendarState): CalendarState {

        let currentView = VIEW.DAY;

        return { ...state, currentView };
    }
}

export class ShowMonthsListView implements Action {

    public reduce(state: CalendarState): CalendarState {
        let currentView = VIEW.MONTH_LIST;

        return { ...state, currentView };
    }
}

export class ShowYearsListView implements Action {

    public reduce(state: CalendarState): CalendarState {

        let currentView = VIEW.YEAR_LIST;

        let vp = new ViewPort(state.yearStartLine);
        vp.showYear(state.displayDate.year()); // TODO
        let yearStartLine = vp.getStartLine();

        return { ...state, currentView, yearStartLine };
    }
}

export class DataChanged implements Action {

    constructor(private date: Mom.Moment) { }

    public reduce(state: CalendarState): CalendarState {

        let currentDate = this.date.clone();
        let selectedDateByUser = this.date.clone();
        let displayDate = this.date.clone().date(1);

        return { ...state, selectedDateByUser, displayDate, currentDate };
    }
}

export class OpenDropDown implements Action {

    public reduce(state: CalendarState): CalendarState {

        let open = true;
        let userEndSelection = false;

        return { ...state, open, userEndSelection };
    }
}

export class CloseDropDownUserAcceptSelection implements Action {

    public reduce(state: CalendarState): CalendarState {

        let open = false;
        let userEndSelection = true;
        let currentDate = state.selectedDateByUser;

        return { ...state, open, userEndSelection, currentDate };
    }
}

export class CloseDropDownUserReectSelection implements Action {

    public reduce(state: CalendarState): CalendarState {

        let open = false;

        return { ...state, open };
    }
}

export enum TimePartNames {
    hour, minutes, seconds, amPm, timeZone
}

export class ChangeTimeDisplayed implements Action {

    constructor(private partName: TimePartNames, private newValue: number | boolean | string) { }

    public reduce(state: CalendarState): CalendarState {

        function createNewState(timeDisplayed: Time) {
            let timeSelection: TimeSelectionState = { ...state.timeSelection, timeDisplayed };
            return { ...state, timeSelection };
        }

        if (!state.selectedDateByUser) {
            return state; // just for change
        }

        let parteName = this.partName.toString();
        console.log(parteName);

        let currentTimeDisplayed = state.timeSelection.timeDisplayed;
        if (this.partName === TimePartNames.hour && typeof this.newValue === 'number') {
            let hour = this.newValue;
            let timeDisplayed: Time = { ...currentTimeDisplayed, hour };
            return createNewState(timeDisplayed);
        }
        if (this.partName === TimePartNames.minutes && typeof this.newValue === 'number') {
            let min = this.newValue;
            let timeDisplayed: Time = { ...currentTimeDisplayed, min };
            return createNewState(timeDisplayed);
        }
        if (this.partName === TimePartNames.seconds && typeof this.newValue === 'number') {
            let sec = this.newValue;
            let timeDisplayed: Time = { ...currentTimeDisplayed, sec };
            return createNewState(timeDisplayed);
        }

        if (this.partName === TimePartNames.amPm && typeof this.newValue === 'boolean') {
            let isAm = this.newValue;
            let timeDisplayed: Time = { ...currentTimeDisplayed, isAm };
            return createNewState(timeDisplayed);
        }

        if (this.partName === TimePartNames.timeZone && typeof this.newValue === 'string') {
            let timeZone = this.newValue;
            let timeDisplayed: Time = { ...currentTimeDisplayed, timeZone };
            return createNewState(timeDisplayed);
        }

        return state;
    }
}