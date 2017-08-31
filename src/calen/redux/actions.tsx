import { CalendarState, VIEW, TimeSelectionState, DateSelectionState } from './state';
import { ViewPort } from './utils';
import {
    convertMomToDateTime, convertDateToMom, convertMomToDate,
    convertDateTimeToDate, convertDateTimeToTime, convertDateAndTimeToDateTime, ZERO_TIME, ZERO_DATE,
    Date, DateTime, Time
} from './dateTime';
import * as Mom from 'moment';
import { CalendarConfig } from './config';

export interface Action {
    reduce(state: CalendarState): CalendarState;
}

export interface InitialState {
    build(): CalendarState;
}

export class InitState implements InitialState {

    constructor(
        private initiallySelected: DateTime | null,
        private defaultDisplayDate: DateTime,
        private calendarConfig: CalendarConfig) {
    }

    build(): CalendarState {

        // handle configuration with default values
        let config = this.calendarConfig;

        let selectedDateTime = this.initiallySelected ? this.initiallySelected : null;

        let displayDateTime = selectedDateTime || this.defaultDisplayDate;

        // date selection
        let dateSel = new DateSelectionState();
        dateSel.currentView = VIEW.DAY;
        dateSel.displayDate = convertDateTimeToDate(displayDateTime) as Date;
        dateSel.selectedDate = convertDateTimeToDate(selectedDateTime);
        dateSel.yearStartLine = 0;

        // time selection
        let timeSel = new TimeSelectionState();
        timeSel.mode24Hours = !config.showAmPm as boolean;
        timeSel.showSeconds = config.showSeconds as boolean;
        timeSel.showTimeZone = config.showTimeZone as boolean;
        // let time = convertMomToTime(date, !timeSel.mode24Hours, timeSel.showSeconds);
        timeSel.timeDisplayed = convertDateTimeToTime(displayDateTime) as Time;
        timeSel.timeSelected = convertDateTimeToTime(selectedDateTime);

        let oldState = new CalendarState();
        oldState.currentDateTime = selectedDateTime;
        oldState.config = config;
        oldState.open = false;
        oldState.userEndSelection = false;
        oldState.dateSelection = dateSel;
        oldState.timeSelection = timeSel;

        return oldState;
    }
}

function cloneStateWith(state: CalendarState, dateSelection: DateSelectionState) {
    return { ...state, dateSelection };
}

export class DayViewGotoPrevMonth implements Action {

    public reduce(state: CalendarState): CalendarState {
        // It can change not only the moth but also the year
        let newDisplayDate = convertDateToMom(state.dateSelection.displayDate).subtract(1, 'M');

        let displayDate = convertMomToDate(newDisplayDate);

        let dateSelection = { ...state.dateSelection, displayDate };

        return cloneStateWith(state, dateSelection);
    }
}

export class DayViewGotoNextMonth implements Action {

    public reduce(state: CalendarState): CalendarState {

        let newDisplayDate = convertDateToMom(state.dateSelection.displayDate).add(1, 'M');

        let displayDate = convertMomToDate(newDisplayDate);

        let dateSelection = { ...state.dateSelection, displayDate };

        return cloneStateWith(state, dateSelection);
    }

}

export class YearViewPortMoveUp implements Action {

    public reduce(state: CalendarState): CalendarState {
        let vp = new ViewPort(state.dateSelection.yearStartLine);
        vp.moveup();

        let yearStartLine = vp.getStartLine();

        let dateSelection = { ...state.dateSelection, yearStartLine };

        return cloneStateWith(state, dateSelection);
    }
}

export class YearViewPortMoveDown implements Action {

    public reduce(state: CalendarState): CalendarState {
        let vp = new ViewPort(state.dateSelection.yearStartLine);
        vp.moveDown();

        let yearStartLine = vp.getStartLine();

        let dateSelection = { ...state.dateSelection, yearStartLine };

        return cloneStateWith(state, dateSelection);
    }
}

export class YearViewSelected implements Action {

    constructor(private newYear: number) {

    }

    public reduce(state: CalendarState): CalendarState {

        const newDisplayDate = convertDateToMom(state.dateSelection.displayDate).year(this.newYear);
        if (!newDisplayDate.isValid()) {
            console.log('invalid date: %s', this.newYear);
            return state;
        }

        let currentView = VIEW.DAY;
        let displayDate = convertMomToDate(newDisplayDate);

        let dateSelection = { ...state.dateSelection, currentView, displayDate };

        return cloneStateWith(state, dateSelection);
    }
}

export class MonthViewSelected implements Action {

    constructor(private newMonth: number) {

    }

    public reduce(state: CalendarState): CalendarState {
        console.log('>> %s', this.newMonth);

        const newDisplayDate = convertDateToMom(state.dateSelection.displayDate).month(this.newMonth);
        if (!newDisplayDate.isValid()) {
            return state;
        }

        let currentView = VIEW.DAY;
        let displayDate = convertMomToDate(newDisplayDate);

        let dateSelection = { ...state.dateSelection, currentView, displayDate };

        return cloneStateWith(state, dateSelection);
    }
}

export class DayViewSelected implements Action {

    constructor(private day: number) {

    }

    public reduce(state: CalendarState): CalendarState {

        console.log('>> %s', this.day);

        const newDisplayDate = convertDateToMom(state.dateSelection.displayDate).date(this.day);
        if (!newDisplayDate.isValid()) {
            return state;
        }

        const selectedDate = convertMomToDate(newDisplayDate);

        let dateSelection = { ...state.dateSelection, selectedDate };

        return cloneStateWith(state, dateSelection);
    }
}

export class ShowDaysView implements Action {

    public reduce(state: CalendarState): CalendarState {

        let currentView = VIEW.DAY;

        let dateSelection = { ...state.dateSelection, currentView };

        return cloneStateWith(state, dateSelection);

    }
}

export class ShowMonthsListView implements Action {

    public reduce(state: CalendarState): CalendarState {
        let currentView = VIEW.MONTH_LIST;

        let dateSelection = { ...state.dateSelection, currentView };

        return cloneStateWith(state, dateSelection);
    }
}

export class ShowYearsListView implements Action {

    public reduce(state: CalendarState): CalendarState {

        let currentView = VIEW.YEAR_LIST;

        let vp = new ViewPort(state.dateSelection.yearStartLine);
        vp.showYear(state.dateSelection.displayDate.year);
        let yearStartLine = vp.getStartLine();

        let dateSelection = { ...state.dateSelection, currentView, yearStartLine };

        return cloneStateWith(state, dateSelection);
    }
}

export class DataChanged implements Action {

    constructor(private date: Mom.Moment | null) {
        console.log('see later' + this.date);
    }

    public reduce(state: CalendarState): CalendarState {

        let currentDateTime: DateTime | null = null;

        let selectedDate: Date | null = null;
        let displayDate: Date = ZERO_DATE;
        let timeSelected: Time | null = null;
        let timeDisplayed: Time = ZERO_TIME;

        if (this.date) {
            currentDateTime = convertMomToDateTime(
                this.date,
                !state.timeSelection.mode24Hours,
                state.timeSelection.showSeconds);

            let b = convertDateTimeToDate(currentDateTime);
            displayDate = b ? b : ZERO_DATE;
            selectedDate = convertDateTimeToDate(currentDateTime);

            timeSelected = convertDateTimeToTime(currentDateTime);

            let a = convertDateTimeToTime(currentDateTime);
            timeDisplayed = a ? a : ZERO_TIME;
        }

        let dateSelection = { ...state.dateSelection, selectedDate, displayDate };
        let timeSelection = { ...state.timeSelection, timeSelected, timeDisplayed };

        let result = cloneStateWith(state, dateSelection);
        result.currentDateTime = currentDateTime;
        result.timeSelection = timeSelection;
        return result;
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

        let dateSel = state.dateSelection.selectedDate;
        let timeSel = state.timeSelection.timeSelected;

        if (!dateSel || !timeSel) {
            return state;
        }

        let open = false;
        let userEndSelection = true;
        let currentDateTime = convertDateAndTimeToDateTime(dateSel, timeSel);

        return { ...state, open, userEndSelection, currentDateTime };
    }
}

export class ClearUserSelection implements Action {

    public reduce(state: CalendarState): CalendarState {

        let selectedDate = null;
        let dateSelection = { ...state.dateSelection, selectedDate };

        let timeSelected = null;
        let timeSelection = { ...state.timeSelection, timeSelected };

        return { ...state, dateSelection, timeSelection };
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
            let timeSelected = { ...timeDisplayed }; // in case the selection is the same as the time selection
            let timeSelection: TimeSelectionState = { ...state.timeSelection, timeDisplayed, timeSelected };
            return { ...state, timeSelection };
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