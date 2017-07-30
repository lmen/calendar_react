import * as Mom from 'moment';

export interface DayInfo {
    day: number;
    currentMonth: boolean;
    selected: boolean;
}

export class MonthDays {
    private data: DayInfo[][] = [];

    constructor() {
        this.init();
    }

    public getMonthDays() {
        return this.data;
    }

    public fillMonthDays(year: number, month: number) {
        let info = { year: year, month: month - 1, day: 1 }; // month is zero based
        let first = Mom(info);

        let firstWeekDate = first.isoWeekday() - 1;
        let last = first;
        if (firstWeekDate !== 0) {
            last = Mom(info).subtract(firstWeekDate, 'd');
        }

        for (let r = 0; r < 6; r++) {
            for (let j = 0; j < 7; j++) {
                this.data[r][j].day = last.date();
                this.data[r][j].currentMonth = last.month() === first.month();
                last.add(1, 'd');
            }
        }
    }

    public daySelected(day: number) {
        for (let r = 0; r < 6; r++) {
            let s = this.data[r];
            for (let j = 0; j < 7; j++) {
                let d = s[j];
                d.selected = d.currentMonth && d.day === day;
            }
        }
    }

    private init() {
        for (let r = 0; r < 6; r++) {
            let s: DayInfo[] = [];
            for (let j = 0; j < 7; j++) {
                s.push({ day: 0, currentMonth: false, selected: false });
            }
            this.data.push(s);
        }
    }

}