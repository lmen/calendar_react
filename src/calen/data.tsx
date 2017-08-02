import * as Mom from 'moment';

export interface DayInfo {
    day: number;
    currentMonth: boolean;
    selected: boolean;
}

export class MonthDays {
    private data: DayInfo[][] = [];
    private displayDate: Mom.Moment;
    private selectedDate: Mom.Moment;

    constructor() {
        this.init();
    }

    public getMonthDays() {
        return this.data;
    }

    public fillMonthDays(displayDate: Mom.Moment) {
        let info = { year: displayDate.year(), month: displayDate.month(), day: 1 }; // month is zero based
        let first = Mom(info);
        this.displayDate = first;

        let firstWeekDate = first.isoWeekday() - 1;
        let last = Mom(info);
        if (firstWeekDate !== 0) {
            last = Mom(info).subtract(firstWeekDate, 'd');
        }

        for (let r = 0; r < 6; r++) {
            for (let j = 0; j < 7; j++) {
                let d = this.data[r][j];
                d.day = last.date();
                d.currentMonth = last.month() === first.month();
                d.selected = this.selectedDate
                    && d.currentMonth && this.displayDate.day(d.day).isSame(this.selectedDate.day());
                last.add(1, 'd');
            }
        }
    }

    public daySelected(selectedDate: Mom.Moment) {
        this.selectedDate = selectedDate.clone();
        let display = Mom(this.displayDate).startOf('hour');

        for (let r = 0; r < 6; r++) {
            let s = this.data[r];
            for (let j = 0; j < 7; j++) {
                let d = s[j];
                d.selected = d.currentMonth && display.day(d.day).isSame(this.selectedDate.day());
            }
        }
    }

    private init() {
        for (let r = 0; r < 6; r++) {
            let s: DayInfo[] = [];
            for (let j = 0; j < 7; j++) {
                s.push({ day: 0, currentMonth: false, selected: false });
            }
            this.data.push(s);
        }
    }

}

export class CalendarState {

    displayDate: Mom.Moment;
    lastSelectedDate: Mom.Moment;
    selectedDateByUser: Mom.Moment;
    weakDays: string[];
    monthDesc: string[];
    monthDays = new MonthDays();

    constructor(
        weakDays: string[], monthDesc: string[], displayDate: Mom.Moment) {
        this.weakDays = weakDays;
        this.monthDesc = monthDesc;
        this.displayDate = displayDate;
    }

}

export interface CalendarStateSubscriber {
    handleCalendarStateChange(newState: CalendarState): void;
}

export class CalendarDispatcher {
    constructor(
        public subscriber: CalendarStateSubscriber,
        public state: CalendarState) {
    }

    displayDateChangeToNew(newDisplayDate: Mom.Moment) {
        this.state.displayDate = newDisplayDate;
        this.state.monthDays.fillMonthDays(newDisplayDate);
    }

    displayDateGoPrevMonthAction() {
        this.state.displayDate = this.state.displayDate.clone().subtract(1, 'M');
        this.state.monthDays.fillMonthDays(this.state.displayDate);

        this.sendToSubscribers();
    }

    displayDateGoNextMonthAction() {
        this.state.displayDate = this.state.displayDate.clone().add(1, 'M');
        this.state.monthDays.fillMonthDays(this.state.displayDate);

        this.sendToSubscribers();
    }

    handleSelectedDay(day: number) {
        this.state.selectedDateByUser = this.state.displayDate.clone().day(day);
        this.state.monthDays.daySelected(this.state.selectedDateByUser);

        this.sendToSubscribers();
    }

    public sendToSubscribers() {
        this.subscriber.handleCalendarStateChange(this.state);
    }
}