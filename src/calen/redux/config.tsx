import { Config } from '../calendar';
import { convertDateAndTimeToDateTime, DateTime, DateTimeToString, Time, Date } from './dateTime';

export class CalendarConfig {
    localeCode = 'en';
    showSeconds = false;
    showTimeZone = true;
    showAmPm = false;
    showDate = true;
    showTime = true;
    inputFormaterFn: (dateTime: DateTime | null, config: Config) => string = inputFormaterFn;
    selectedDataFormaterFn: (date: Date | null, time: Time | null, config: Config) => string = selectedDateFormaterFn;
}

export function createCalendarConfig(publicConfig: Config): CalendarConfig {
    // handle configuration with default values
    let finalConfig = new CalendarConfig();
    if (publicConfig) {
        finalConfig.localeCode = publicConfig.localeCode || finalConfig.localeCode;
        finalConfig.showSeconds = publicConfig.showSeconds || finalConfig.showSeconds;
        finalConfig.showAmPm = publicConfig.showAmPm || finalConfig.showAmPm;
        finalConfig.inputFormaterFn = publicConfig.inputFormaterFn || finalConfig.inputFormaterFn;
        finalConfig.selectedDataFormaterFn = publicConfig.dropDownFormaterFn || finalConfig.selectedDataFormaterFn;

        let workingMode = publicConfig.workingMode;
        switch (workingMode) {
            case 'time':
                finalConfig.showDate = false;
                break;
            case 'date':
                finalConfig.showTime = false;
                break;
            default:
        }
    }

    return finalConfig;
}

export const Messages = {
    selectedDateNonExistent: 'No Date ',
    selectedTimeNonExistent: 'No Time'
};

function inputFormaterFn(dateTime: DateTime | null, config: CalendarConfig): string {

    let format = config.showDate ? 'YYYY-MM-DD' : '';
    format += config.showTime ? (' HH:mm' +
        (config.showSeconds ? ':ss' : '')
        + (config.showAmPm ? 'a' : '')) : '';

    return DateTimeToString(dateTime, format);
}

function selectedDateFormaterFn(date: Date | null, time: Time | null, config: CalendarConfig): string {

    function checkEmptyDate(): string | null {
        let msg = '';
        if (config.showDate && date === null) {
            msg = Messages.selectedDateNonExistent;
        }

        if (config.showTime && date === null) {
            msg += Messages.selectedTimeNonExistent;
        }
        return msg === '' ? null : msg;
    }

    let msgA = checkEmptyDate();
    if (msgA) {
        return msgA;
    }

    let format = config.showDate ? 'YYYY-MM-DD' : '';
    format += config.showTime ? (' HH:mm' +
        (config.showSeconds ? ':ss' : '')
        + (config.showAmPm ? 'a' : '')) : '';

    return DateTimeToString(convertDateAndTimeToDateTime(date, time), format);
}