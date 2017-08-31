import { Config } from '../calendar';
import { DateTime, DateTimeToString } from './dateTime';

export class CalendarConfig {
    localeCode = 'en';
    showSeconds = false;
    showTimeZone = true;
    showAmPm = false;
    showDate = true;
    showTime = true;
    inputFormaterFn: (dateTime: DateTime | null, config: Config) => string = inputFormaterFn;
    dropDownFormaterFn: (dateTime: DateTime | null, config: Config) => string;
}

export function createCalendarConfig(publicConfig: Config): CalendarConfig {
    // handle configuration with default values
    let finalConfig = new CalendarConfig();
    if (publicConfig) {
        finalConfig.localeCode = publicConfig.localeCode || finalConfig.localeCode;
        finalConfig.showSeconds = publicConfig.showSeconds || finalConfig.showSeconds;
        finalConfig.showAmPm = publicConfig.showAmPm || finalConfig.showAmPm;
        finalConfig.inputFormaterFn = publicConfig.inputFormaterFn || finalConfig.inputFormaterFn;
        finalConfig.dropDownFormaterFn = publicConfig.dropDownFormaterFn || finalConfig.dropDownFormaterFn;

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

function inputFormaterFn(dateTime: DateTime | null, config: CalendarConfig): string {

    let format = config.showDate ? 'YYYY-MM-DD' : '';
    format += config.showTime ? (' HH:mm' +
        (config.showSeconds ? ':ss' : '')
        + (config.showAmPm ? 'a' : '')) : '';

    return DateTimeToString(dateTime, format);
}