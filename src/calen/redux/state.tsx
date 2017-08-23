import * as Mom from 'moment';
import { Config } from '../calendar';

export enum VIEW { DAY, MONTH_LIST, YEAR_LIST }

export const AM_PM_VALUES = ['AM', 'PM'];
export const TIME_ZONE_VALUES = ['LISBON', 'MADRID', 'PARIS', 'ROME'];

export class CalendarState {

    open: boolean;
    userEndSelection: boolean;
    currentView: VIEW;
    currentDate: Mom.Moment | null;
    displayDate: Mom.Moment;
    selectedDateByUser: Mom.Moment | null;
    yearStartLine: number;

    timeSelection24Hours: boolean;
    timeSelectionShowSeconds: boolean;
    timeSelectionShowTimeZone: boolean;

    // selected by user
    timeSelectionAmPmIndex: number;
    timeSelectionTimeZoneIndex: number;

    config: Config;

}