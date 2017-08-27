import * as Mom from 'moment';
import { Config } from '../calendar';

export enum VIEW { DAY, MONTH_LIST, YEAR_LIST }

export class CalendarState {

    open: boolean;
    currentView: VIEW;
    userEndSelection: boolean;

    currentDate: Mom.Moment | null;
    displayDate: Mom.Moment;
    selectedDateByUser: Mom.Moment | null;
    yearStartLine: number;

    timeSelection: TimeSelectionState;

    config: Config;

}

export class Date {
    year: number;
    month: number;
    day: number;
}

export class Time {
    hour: number;
    min: number;
    sec?: number;
    isAm?: boolean;
    timeZone?: string;
}

export class TimeSelectionState {
    mode24Hours: boolean;
    showSeconds: boolean;
    showTimeZone: boolean;

    timeDisplayed: Time;

}