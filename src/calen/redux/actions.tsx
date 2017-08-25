import { CalendarState, VIEW, TimeSelectionState } from './state';
import {
    ViewPort, TIME_ZONE_VALUES, ValueList, Hours24, HoursAmPm,
    MinutesSeconds, AM_PM_VALUES, TimeUtils
} from './utils';
import * as Mom from 'moment';
import { Config } from '../calendar';

export interface Action {
    reduce(state: CalendarState): CalendarState;
}

export interface InitialState {
    build(): CalendarState;
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

        oldState.timeSelection = new TimeSelectionState();
        let mode24Hours = false;
        oldState.timeSelection.mode24Hours = mode24Hours; // it should depend from the locale config
        oldState.timeSelection.showSeconds = true;
        oldState.timeSelection.showTimeZone = true;

        oldState.timeSelection.hourList = new ValueList<number>(mode24Hours ? Hours24 : HoursAmPm);
        oldState.timeSelection.minuteList = new ValueList<number>(MinutesSeconds);
        oldState.timeSelection.secondList = new ValueList<number>(MinutesSeconds);
        oldState.timeSelection.amPmList = new ValueList<string>(AM_PM_VALUES);
        oldState.timeSelection.timeZoneIndex = new ValueList<string>(TIME_ZONE_VALUES);

        if (!mode24Hours) {
            let p = new TimeUtils().toAMPmFormat(date.hours());
            oldState.timeSelection.hourList.selectKey(p.hourAMPM);
            oldState.timeSelection.amPmList.selectKey(p.isAm ? AM_PM_VALUES[0].key : AM_PM_VALUES[1].key);
        }
        oldState.timeSelection.minuteList.selectKey(date.minutes());
        oldState.timeSelection.secondList.selectKey(date.seconds());
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

    constructor(private partName: TimePartNames, private up: boolean) { }

    public reduce(state: CalendarState): CalendarState {

        if (!state.selectedDateByUser) {
            return state; // just for change
        }

        let displayDate = state.displayDate.clone();

        let parteName = this.partName.toString();
        console.log(parteName);

        if (this.partName === TimePartNames.hour) {
            this.up ? displayDate.add(1, 'hour') : displayDate.subtract(1, 'hour');
        }
        if (this.partName === TimePartNames.minutes) {
            this.up ? displayDate.add(1, 'minutes') : displayDate.subtract(1, 'minutes');
        }
        if (this.partName === TimePartNames.seconds) {
            this.up ? displayDate.add(1, 'seconds') : displayDate.subtract(1, 'seconds');
        }
        /*
                let timeSelectionAmPmIndex = state.timeSelectionAmPmIndex;
                if (this.partName === TimePartNames.amPm) {
                    const arraySize = 2;
                    timeSelectionAmPmIndex = Math.abs((timeSelectionAmPmIndex + (this.up ? +1 : -1)) % arraySize);
                    // needs to change on the moment.
                }
        
                let timeSelectionTimeZoneIndex = state.timeSelectionTimeZoneIndex;
                if (this.partName === TimePartNames.timeZone) {
                    const arraySize = TIME_ZONE_VALUES.length;
                    timeSelectionTimeZoneIndex = Math.abs((timeSelectionTimeZoneIndex + (this.up ? +1 : -1))
                     % arraySize);
                    // needs to change on the moment.
                }
        */
        let selectedDateByUser = state.selectedDateByUser.clone();
        selectedDateByUser.hour(displayDate.hour());
        selectedDateByUser.minutes(displayDate.minutes());

        return { ...state, displayDate, selectedDateByUser }; // , timeSelectionAmPmIndex, timeSelectionTimeZoneIndex };
    }
}