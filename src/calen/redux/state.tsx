import * as Mom from 'moment';

export enum VIEW { DAY, MONTH_LIST, YEAR_LIST }

export class CalendarState {

    currentView: VIEW;
    displayDate: Mom.Moment;
    lastSelectedDate: Mom.Moment;
    selectedDateByUser: Mom.Moment;

    // locale
    weakDays: string[];
    monthDesc: string[];

    yearStartLine: number;

    constructor(
        weakDaysTo: string[], monthDescTo: string[]) {
        this.weakDays = weakDaysTo;
        this.monthDesc = monthDescTo;
    }

}