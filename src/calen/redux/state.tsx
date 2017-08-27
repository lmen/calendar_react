import { Config } from '../calendar';

export enum VIEW { DAY, MONTH_LIST, YEAR_LIST }

export class CalendarState {

    config: Config;

    open: boolean;
    userEndSelection: boolean;
    currentDateTime: DateTime | null;

    dateSelection: DateSelectionState;

    timeSelection: TimeSelectionState;

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

export class DateTime implements Date, Time {
    year: number;
    month: number;
    day: number;
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
    timeSelected: Time | null;

}

export class DateSelectionState {
    localeCode: string;
    currentView: VIEW;
    displayDate: Date;
    selectedDate: Date | null;
    yearStartLine: number;

}