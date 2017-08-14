import * as Mom from 'moment';
import { CalendarState, VIEW } from './state';
import { MONTH_DESC, WEAK_DAYS } from './locale';
import { Action } from './actions';

export interface CalendarStateSubscriber {
    handleCalendarStateChange(newState: CalendarState): void;
}

export class Store {

    private currentState: CalendarState;

    constructor(
        selectedDate: Mom.Moment,
        public subscriber: CalendarStateSubscriber) {

        this.currentState = this.getInitialState(selectedDate);
    }

    protected getInitialState(currentDate: Mom.Moment): CalendarState {

        let oldState = new CalendarState(WEAK_DAYS, MONTH_DESC);

        oldState.open = false;
        oldState.currentView = VIEW.DAY;
        oldState.userEndSelection = false;

        oldState.currentDate = currentDate ? currentDate.clone() : null;
        let date = currentDate || Mom.now();
        oldState.displayDate = date.clone().date(1);
        oldState.selectedDateByUser = date;

        return oldState;
    }

    apply(action: Action) {

        let newState = action.reduce(this.currentState);

        this.currentState = newState;

        this.subscriber.handleCalendarStateChange(newState);
    }

    getCurrentState(): CalendarState {
        return this.currentState;
    }
}