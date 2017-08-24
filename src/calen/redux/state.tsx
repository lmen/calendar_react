import * as Mom from 'moment';
import { Config } from '../calendar';
import { ValueList } from './utils';

export enum VIEW { DAY, MONTH_LIST, YEAR_LIST }

export class CalendarState {

    open: boolean;
    userEndSelection: boolean;
    currentView: VIEW;
    currentDate: Mom.Moment | null;
    displayDate: Mom.Moment;
    selectedDateByUser: Mom.Moment | null;
    yearStartLine: number;

    timeSelection: {
        mode24Hours: boolean;
        showSeconds: boolean;
        showTimeZone: boolean;

        // selected by user
        hourList: ValueList<number>
        minuteList: ValueList<number>
        secondList: ValueList<number>
        amPmList: ValueList<string>
        timeZoneIndex: ValueList<string>;

    };

    config: Config;

}