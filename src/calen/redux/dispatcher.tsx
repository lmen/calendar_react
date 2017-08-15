import { CalendarState } from './state';
import { Action, InitialState } from './actions';

export interface CalendarStateSubscriber {
    handleCalendarStateChange(newState: CalendarState): void;
}

export class Store {

    private currentState: CalendarState;

    constructor(
        initialyState: InitialState,
        public subscriber: CalendarStateSubscriber) {

        this.currentState = initialyState.build();
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