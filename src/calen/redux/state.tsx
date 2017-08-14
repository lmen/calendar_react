import * as Mom from 'moment';

export enum VIEW { DAY, MONTH_LIST, YEAR_LIST }

export class CalendarState {

    open: boolean;
    userEndSelection: boolean;
    currentView: VIEW;
    currentDate: Mom.Moment | null;
    displayDate: Mom.Moment;
    selectedDateByUser: Mom.Moment | null;
    yearStartLine: number;

    // locale
    weakDays: string[];
    monthDesc: string[];

    constructor(
        weakDaysTo: string[], monthDescTo: string[]) {
        this.weakDays = weakDaysTo;
        this.monthDesc = monthDescTo;
    }

}