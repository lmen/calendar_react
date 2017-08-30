import { Config } from '../calendar';
import { DateTime, Time, Date } from './dateTime';

export enum VIEW { DAY, MONTH_LIST, YEAR_LIST }

export class CalendarState {

    config: Config;

    open: boolean;
    userEndSelection: boolean;
    currentDateTime: DateTime | null;

    dateSelection: DateSelectionState;

    timeSelection: TimeSelectionState;

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