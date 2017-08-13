import { CalendarState, VIEW } from './state';
import { ViewPort } from './utils';
import * as Mom from 'moment';

export interface Action {
    reduce(state: CalendarState): CalendarState;
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

        let selectedDateByUser = this.date.clone();
        let displayDate = this.date.clone().date(1);

        return { ...state, selectedDateByUser, displayDate };
    }
}

export class OpenDropDown implements Action {

    public reduce(state: CalendarState): CalendarState {

        let open = true;

        return { ...state, open };
    }
}

export class CloseDropDown implements Action {

    public reduce(state: CalendarState): CalendarState {

        let open = false;

        return { ...state, open };
    }
}