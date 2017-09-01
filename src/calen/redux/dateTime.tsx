import * as Mom from 'moment';
import { TimeUtils } from './utils';

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

export class DateTime {
    date: Date | null;
    time: Time | null;
}

export function convertMomToDateTime(mom: Mom.Moment | null, hasAmPm: boolean, withSeconds: boolean): DateTime | null {
    if (!mom) {
        return null;
    }
    let dateTime = new DateTime();
    dateTime.date = new Date();
    dateTime.time = new Time();

    dateTime.date.year = mom.year();
    dateTime.date.month = mom.month() + 1;
    dateTime.date.day = mom.date();

    dateTime.time.hour = mom.hours();
    if (hasAmPm) {
        let p = new TimeUtils().toAMPmFormat(dateTime.time.hour);
        dateTime.time.isAm = p.isAm;
    }
    dateTime.time.min = mom.minutes();
    if (withSeconds) {
        dateTime.time.sec = mom.seconds();
    }

    dateTime.time.timeZone = 'LISBON'; // to be defined later

    return dateTime;
}

export function convertDateTimeToMom(a: DateTime): Mom.Moment {

    let confi: Mom.MomentInputObject = {};
    if (a.date) {
        confi.year = a.date.year;
        confi.month = a.date.month - 1;
        confi.day = a.date.day;
    }

    if (a.time) {
        confi.hour = a.time.isAm !== undefined ? new TimeUtils().to24Hours(a.time.hour, a.time.isAm) : a.time.hour;
        confi.minutes = a.time.min;
        confi.seconds = a.time.sec;
    }

    let date = Mom(confi);

    return date;
}

export function convertDateAndTimeToDateTime(date: Date | null, time: Time | null): DateTime {
    let dateTime = new DateTime();

    if (date) {
        dateTime.date = { ...date };
    }

    if (time) {
        dateTime.time = { ...time };
    }

    return dateTime;
}

export function convertDateTimeToDate(a: DateTime | null): Date | null {
    if (!a || !a.date) {
        return null;
    }
    return { ...a.date };
}

export function convertDateTimeToTime(a: DateTime | null): Time | null {
    if (!a || !a.time) {
        return null;
    }
    return { ...a.time };
}

export function convertDateToMom(a: Date): Mom.Moment {

    let date = Mom({
        year: a.year,
        month: a.month - 1,
        day: a.day,
    });

    return date;
}

export function convertMomToDate(mom: Mom.Moment): Date {
    let date = new Date();

    date.year = mom.year();
    date.month = mom.month() + 1;
    date.day = mom.date();

    return date;
}

export function DateTimeToString(a: DateTime | null, format: string): string {
    if (!a) {
        return '';
    }
    let m = convertDateTimeToMom(a);

    return m.format(format);
}

export function areDateTimeDifferent(a: DateTime | null, b: DateTime | null): boolean {
    if (a !== null && b !== null) {
        let res = false;
        if (a.date !== null && b.date !== null) {
            res = !(a.date.year === b.date.year &&
                a.date.month === b.date.month &&
                a.date.day === b.date.day);
        } else {
            res = a.date !== b.date;
        }
        if (res) {
            return true;
        }
        if (a.time !== null && b.time !== null) {
            res = !(a.time.hour === b.time.hour &&
                a.time.isAm === b.time.isAm &&
                a.time.min === b.time.min &&
                a.time.sec === b.time.sec &&
                a.time.timeZone === b.time.timeZone);
        } else {
            res = a.time !== b.time;
        }
        return res;
    }
    return b !== a;
}

export const ZERO_TIME = { hour: 0, min: 0, sec: 0, isAm: false, timeZone: undefined };
export const ZERO_DATE = { year: 1920, month: 1, day: 1 };