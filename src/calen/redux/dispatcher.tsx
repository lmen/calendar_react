import { CalendarState } from './state';
import { Action, InitialState } from './actions';

export interface CalendarStateSubscriber {
    handleCalendarStateChange(newState: CalendarState, oldState?: CalendarState): void;
}

export class Store {

    private currentState: CalendarState;

    constructor(
        initialyState: InitialState,
        public subscriber: CalendarStateSubscriber) {

        this.currentState = initialyState.build();
    }

    apply(action: Action) {

        let oldState = this.currentState;
        let newState = action.reduce(this.currentState);

        this.currentState = newState;

        this.subscriber.handleCalendarStateChange(newState, oldState);
    }

    getCurrentState(): CalendarState {
        return this.currentState;
    }
}