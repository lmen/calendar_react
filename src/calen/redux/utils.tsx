import * as Mom from 'moment';

export interface DayInfo {
    day: number;
    currentMonth: boolean;
}

export class MonthDays {
    private data: DayInfo[][] = [];

    constructor() {
        this.init();
    }

    public getMonthDays() {
        return this.data;
    }

    public fillMonthDays(displayDate: Mom.Moment) {
        let info = { year: displayDate.year(), month: displayDate.month(), day: 1 }; // month is zero based
        let firstDayOfDisplayMonth = Mom(info);

        let dayToDisplay = Mom(firstDayOfDisplayMonth);

        let firstWeekDate = firstDayOfDisplayMonth.isoWeekday() - 1;
        if (firstWeekDate !== 0) {
            dayToDisplay = Mom(info).subtract(firstWeekDate, 'd');
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

export class ViewPort {

    constructor(private years: number[][], private maxLines: number, private startLine: number = 0) {
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

}