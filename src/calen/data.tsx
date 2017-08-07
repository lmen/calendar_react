import * as Mom from 'moment';

export const WEAK_DAYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
export const MONTH_DESC = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export interface DayInfo {
    day: number;
    currentMonth: boolean;
}

export class MonthDays {
    private data: DayInfo[][] = [];

    constructor() {
        this.init();
    }

    public getMonthDays() {
        return this.data;
    }

    public fillMonthDays(displayDate: Mom.Moment) {
        let info = { year: displayDate.year(), month: displayDate.month(), day: 1 }; // month is zero based
        let firstDayOfDisplayMonth = Mom(info);

        let dayToDisplay = Mom(firstDayOfDisplayMonth);

        let firstWeekDate = firstDayOfDisplayMonth.isoWeekday() - 1;
        if (firstWeekDate !== 0) {
            dayToDisplay = Mom(info).subtract(firstWeekDate, 'd');
        }

        for (let weekDay = 0; weekDay < 6; weekDay++) {
            for (let week = 0; week < 7; week++) {
                let d = this.data[weekDay][week];
                d.day = dayToDisplay.date();
                d.currentMonth = dayToDisplay.month() === firstDayOfDisplayMonth.month();
                dayToDisplay.add(1, 'd');
            }
        }
    }

    private init() {
        for (let weekDay = 0; weekDay < 6; weekDay++) {
            let s: DayInfo[] = [];
            for (let week = 0; week < 7; week++) {
                s.push({ day: 0, currentMonth: false });
            }
            this.data.push(s);
        }
    }

}

const YEAR_VIRE_PORT_LINE = 6;
export enum VIEW { DAY, MONTH_LIST, YEAR_LIST }

export class CalendarState {

    currentView: VIEW;
    displayDate: Mom.Moment;
    lastSelectedDate: Mom.Moment;
    selectedDateByUser: Mom.Moment;
    weakDays: string[];
    monthDesc: string[];
    monthDays = new MonthDays();
    yearsViewPort = new ViewPort(YEARS_MATRIX, YEAR_VIRE_PORT_LINE);

    constructor(
        weakDaysTo: string[], monthDescTo: string[], displayDate: Mom.Moment) {
        this.weakDays = weakDaysTo;
        this.monthDesc = monthDescTo;
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

    yearSelected(newYear: number) {
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

    monthSelected(newMonth: number) {
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

    daySelected(day: number) {

        // tslint:disable-next-line:no-console
        console.log('>> %s', day);

        const newDisplayDate = this.state.displayDate.clone().date(day);
        if (!newDisplayDate.isValid()) {
            return;
        }

        this.state.selectedDateByUser = newDisplayDate;

        this.sendToSubscribers();
    }

    displayDateChangeToNew(newDisplayDate: Mom.Moment) {
        this.state.displayDate = newDisplayDate;
        this.state.monthDays.fillMonthDays(newDisplayDate);

        this.sendToSubscribers();
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

    showDays() {

        this.state.currentView = VIEW.DAY;

        this.sendToSubscribers();
    }

    showMonthsList() {

        this.state.currentView = VIEW.MONTH_LIST;

        this.sendToSubscribers();
    }

    showYearsList() {
        this.state.currentView = VIEW.YEAR_LIST;
        this.state.yearsViewPort.showYear(this.state.displayDate.year());

        this.sendToSubscribers();
    }

    public sendToSubscribers() {
        this.subscriber.handleCalendarStateChange(this.state);
    }
}

export function listToMatrix(list: string[], matrixColSize: number): string[][] {
    let rows: string[][] = [];

    let row: string[] = [];
    for (let index = 0; index < list.length; index++) {
        if (index % matrixColSize === 0) {
            row = [];
            rows.push(row);
        }
        let element = list[index];
        row.push(element);
    }

    return rows;
}

export function findRowOfyear(years: number[][], year: number): number {
    for (let i = 0; i < years.length; i++) {
        for (let j = 0; j < years[i].length; j++) {
            if (years[i][j] === year) {
                return i;
            }
        }
    }
    return -1;
}

const YEAR_COL_SIZE = 6;
const YEARS_MATRIX = yearsMatrix(YEAR_COL_SIZE);

export function yearsMatrix(matrixColSize: number): number[][] {
    let rows: number[][] = [];

    let row: number[] = [];
    for (let year = 1920, i = 0; year < 2100; year++ , i++) {
        if (i % matrixColSize === 0) {
            row = [];
            rows.push(row);
        }
        row.push(year);
    }

    return rows;
}

export function showYearInViewPort(years: number[][], viewPortLines: number, yearToShow: number): number {
    let numRow = findRowOfyear(years, yearToShow);
    if (numRow < 0) {
        return numRow;
    }

    return Math.max(0, numRow - Math.floor(((viewPortLines - 1) / 2)));
}

export function vpMoveup(years: number[][], startLine: number): number {
    return Math.max(0, startLine - 1);
}

export function vpMoveDown(years: number[][], startLine: number): number {
    return Math.min(years.length - 1, startLine + 1);
}

export function vpEndLine(years: number[][], startLine: number, vpMaxLines: number): number {
    return Math.min(years.length - 1, startLine + vpMaxLines - 1);
}

export class ViewPort {

    constructor(private years: number[][], private maxLines: number, private startLine: number = 0) {
    }

    showYear(yearToShow: number): void {
        let numRow = findRowOfyear(this.years, yearToShow);
        if (numRow < 0) {
            return;
        }

        this.startLine = Math.max(0, numRow - Math.floor(((this.maxLines - 1) / 2)));
    }

    moveup(): void {
        this.startLine = Math.max(0, this.startLine - 1);
    }

    moveDown(): void {
        this.startLine = Math.min(this.years.length - 1, this.startLine + 1);
    }

    public content(): number[][] {
        const endLine = Math.min(this.years.length - 1, this.startLine + this.maxLines - 1);
        return this.years.slice(this.startLine, endLine + 1);
    }

}