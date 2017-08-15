import * as Mom from 'moment';
import { Config } from '../calendar';

export enum VIEW { DAY, MONTH_LIST, YEAR_LIST }

export class CalendarState {

    open: boolean;
    userEndSelection: boolean;
    currentView: VIEW;
    currentDate: Mom.Moment | null;
    displayDate: Mom.Moment;
    selectedDateByUser: Mom.Moment | null;
    yearStartLine: number;

    config: Config;

}