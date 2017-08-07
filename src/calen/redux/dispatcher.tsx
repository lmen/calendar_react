import * as Mom from 'moment';
import { CalendarState, VIEW } from './state';

export interface CalendarStateSubscriber {
    handleCalendarStateChange(newState: CalendarState): void;
}

export class CalendarDispatcher {
    constructor(
        public subscriber: CalendarStateSubscriber,
        public state: CalendarState) {
    }

    init(selectedDate: Mom.Moment) {

        selectedDate = selectedDate || Mom.now();

        this.state.currentView = VIEW.DAY;
        this.state.displayDate = selectedDate.clone().date(1);

        this.state.lastSelectedDate = selectedDate;
        this.state.selectedDateByUser = selectedDate;

        this.state.monthDays.fillMonthDays(selectedDate);
        this.state.yearsViewPort.showYear(selectedDate.year());

        // Is to be called on a component constructor, don't inform the subscriber
    }

    yearViewPortMoveUp() {
        this.state.yearsViewPort.moveup();

        this.sendToSubscribers();
    }

    yearViewPortMoveDown() {
        this.state.yearsViewPort.moveDown();

        this.sendToSubscribers();
    }

    yearViewSelected(newYear: number) {
        const newDisplayDate = this.state.displayDate.clone().year(newYear);
        if (!newDisplayDate.isValid()) {
            // tslint:disable-next-line:no-console
            console.log('invalid date: %s', newYear);
            return;
        }

        // this.state.selectedDateByUser = newDisplayDate;
        this.state.currentView = VIEW.DAY;
        this.state.displayDate = newDisplayDate;
        this.state.monthDays.fillMonthDays(newDisplayDate);

        this.sendToSubscribers();
    }

    monthViewSelected(newMonth: number) {
        // tslint:disable-next-line:no-console
        console.log('>> %s', newMonth);

        const newDisplayDate = this.state.displayDate.clone().month(newMonth);
        if (!newDisplayDate.isValid()) {
            return;
        }

        this.state.currentView = VIEW.DAY;
        this.state.displayDate = newDisplayDate;
        this.state.monthDays.fillMonthDays(newDisplayDate);

        this.sendToSubscribers();
    }

    dayViewSelected(day: number) {

        // tslint:disable-next-line:no-console
        console.log('>> %s', day);

        const newDisplayDate = this.state.displayDate.clone().date(day);
        if (!newDisplayDate.isValid()) {
            return;
        }

        this.state.selectedDateByUser = newDisplayDate;

        this.sendToSubscribers();
    }

    dayViewGotoPrevMonth() {
        this.state.displayDate = this.state.displayDate.clone().subtract(1, 'M');
        this.state.monthDays.fillMonthDays(this.state.displayDate);

        this.sendToSubscribers();
    }

    dayViewGotoNextMonth() {
        this.state.displayDate = this.state.displayDate.clone().add(1, 'M');
        this.state.monthDays.fillMonthDays(this.state.displayDate);

        this.sendToSubscribers();
    }

    showDaysView() {

        this.state.currentView = VIEW.DAY;

        this.sendToSubscribers();
    }

    showMonthsListView() {

        this.state.currentView = VIEW.MONTH_LIST;

        this.sendToSubscribers();
    }

    showYearsListView() {
        this.state.currentView = VIEW.YEAR_LIST;
        this.state.yearsViewPort.showYear(this.state.displayDate.year());

        this.sendToSubscribers();
    }

    public sendToSubscribers() {
        this.subscriber.handleCalendarStateChange(this.state);
    }
}