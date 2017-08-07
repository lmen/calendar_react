import * as Mom from 'moment';
import { yearsMatrix, ViewPort, MonthDays } from './utils';

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

const YEAR_VIRE_PORT_LINE = 6;
const YEAR_COL_SIZE = 6;
const YEARS_MATRIX = yearsMatrix(YEAR_COL_SIZE);