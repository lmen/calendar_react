import * as Mom from 'moment';
import * as MomTz from 'moment-timezone';
import { convertDateToMom, Date } from './dateTime';

export interface DayInfo {
    day: number;
    currentMonth: boolean;
}

export class MonthDays {
    private data: DayInfo[][] = [];

    constructor(private localeCode: string) {
        this.init();
    }

    public getMonthDays() {
        return this.data;
    }

    public fillMonthDays(displayDate: Date) {
        let firstDayOfDisplayMonth = convertDateToMom(displayDate);
        firstDayOfDisplayMonth.date(1); // Goto first day of month
        firstDayOfDisplayMonth.locale(this.localeCode);

        let dayToDisplay = firstDayOfDisplayMonth.clone();

        let firstWeekDate = firstDayOfDisplayMonth.weekday();  //
        if (firstWeekDate > 0) {
            dayToDisplay.subtract(firstWeekDate, 'd');
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

export function localeListOfMonths(localeCode: string): string[] {
    var mo = Mom.localeData(localeCode);
    return mo.months();
}
export function localeListOfMonthsShort(localeCode: string): string[] {
    var mo = Mom.localeData(localeCode);
    return mo.monthsShort();
}

export function localeListOfWeekDaysShort(localeCode: string): string[] {
    function shiftToLocale(firstDayOfWeek: number, listWeekDays: string[]) {
        let out = [];
        for (let i = 0; i < 7; i++) {
            out[i] = listWeekDays[(i + firstDayOfWeek) % 7];
        }
        return out;
    }
    var mo = Mom.localeData(localeCode);
    // list has an array like sunday, monday, ... no matter the specified locale
    let list = mo.weekdaysShort();
    return shiftToLocale(mo.firstDayOfWeek(), list);
}

const YEAR_VIRE_PORT_LINE = 6;
const YEAR_COL_SIZE = 6;
const YEARS_MATRIX = yearsMatrix(YEAR_COL_SIZE);

export class ViewPort {
    private years: number[][] = YEARS_MATRIX;
    private maxLines: number = YEAR_VIRE_PORT_LINE;

    constructor(private startLine: number = 0) {
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

    getStartLine() {
        return this.startLine;
    }

}

export class TimeUtils {

    /*
Here's how to convert time on a 24-hour clock to the 12-hour system:

    From 0:00 (midnight) to 0:59, add 12 hours and use am.
    0:49 = 12:49 am (0:49 + 12)

    From 1:00 to 11:59, just add am after the time.
    11:49 = 11:49 am

    From 12:00 to 12:59, just add pm after the time.
    12:49 = 12:49 pm

    From 13:00 to 0:00, subtract 12 hours and use pm.
    13:49 = 1:49 pm (13:49 - 12)

*/
    public toAMPmFormat(hour24: number): { hourAMPM: number, isAm: boolean } {
        let a = hour24 % 12;
        return {
            hourAMPM: a === 0 ? 12 : a,
            isAm: (hour24 / 12) < 1
        };
    }

    /*
    To convert am or pm time to the 24-hour format, use these rules:

        From midnight to 12:59 am, subtract 12 hours.
        12:49 am = 0:49 (12:49 – 12)

        From 1 am to noon, do nothing.
        11:49 am = 11:49

        From 12:01 pm to 12:59 pm, do nothing.
        12:49 pm = 12:49

        From 1:00 pm to midnight, add 12 hours.
        1:49 pm = 13:49 (1:49 + 12)
    */
    public to24Hours(amPmHour: number, isAm: boolean) {
        return isAm ? (amPmHour === 12 ? 0 : amPmHour) : /* pm case */ ((amPmHour === 12 ? 0 : amPmHour) + 12);
    }

}

export class MomentToSceen {

    hour: string;
    min: string;
    seconds: string;
    isAm: boolean;

    constructor(moment: Mom.Moment, isAmPm: boolean) {
        this.convert(moment, isAmPm);
    }

    private convert(moment: Mom.Moment, isAmPm: boolean) {
        let isAm = false;
        let h = moment.hour();
        if (isAmPm) {
            let amPmFormat = new TimeUtils().toAMPmFormat(h);
            h = amPmFormat.hourAMPM;
            isAm = amPmFormat.isAm;
        }
        this.isAm = isAm;
        this.hour = lpad(h);

        this.min = lpad(moment.minutes());
        this.seconds = lpad(moment.seconds());
    }

}

function buildValues(start: number, end: number): Value<number>[] {
    let res: Value<number>[] = [];
    for (let index = start; index < end; index++) {
        let v: Value<number> = { key: index, label: lpad(index) };
        res.push(v);
    }
    return res;
}

export function lpad(n: number): string {
    return n < 10 ? '0' + n : Number(n).toString();
}

export const HoursAmPm: Value<number>[] = buildValues(1, 11);
HoursAmPm.unshift({ key: 12, label: '12' });
export const Hours24: Value<number>[] = buildValues(0, 24);
export const MinutesSeconds: Value<number>[] = buildValues(0, 60);

export const AM_PM_VALUES: Value<string>[] = [
    { key: 'am', label: 'AM' },
    { key: 'pm', label: 'PM' }
];

export const TIME_ZONE_VALUES: Value<string>[] =
    MomTz.tz.names().map((c) => {
        return { key: c, label: c };
    });
/*export const TIME_ZONE_VALUES: Value<string>[] = [
    { key: 'LISBON', label: 'LISBON' },
    { key: 'MADRID', label: 'MADRID' },
    { key: 'ROME', label: 'ROME' },
    { key: 'PARIS', label: 'PARIS' }
];*/

export class Value<K> {
    key: K;
    label: string;
}

export class ValueList<K> {
    currentIndex: number;

    constructor(private values: Value<K>[]) {
        this.currentIndex = 0;
    }

    selectKey(key: K) {
        this.values.find((v) => v.key === key);
    }

    moveUp() {
        this.currentIndex++;
        if (this.currentIndex >= this.values.length) {
            this.currentIndex = 0;
        }
    }

    moveDown() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.values.length - 1;
        }
    }

    getLabelFromSelected() {
        return this.values[this.currentIndex].key;
    }

}