// import * as enzyme from 'enzyme';
// import * as React from 'react';
import * as Mom from 'moment';
import {
    MonthDays, listToMatrix, yearsMatrix, findRowOfyear
} from './redux/utils';

it('renders the correct text when no enthusiasm level is given', () => {
    let a = { year: 2017, month: 7 - 1, day: 1 };
    let first = Mom(a); // '01-07-2017', 'DD-MM-YYYY');
    let last = Mom(a).add(1, 'M').subtract(1, 'd');
    let firstWeekDate = first.isoWeekday() - 1;
    let monthDays = last.date();

    // 1: monday
    // 7 : sunday
    expect(Mom(a).format()).toEqual('2017-07-01T00:00:00+01:00');
    expect(Mom('01-07-2017', 'DD-MM-YYYY').format()).toEqual('2017-07-01T00:00:00+01:00');
    expect(monthDays).toEqual(31);
    expect(firstWeekDate).toEqual(5);

    let day = Mom('01-07-2017', 'DD-MM-YYYY');
    let a1 = new MonthDays();
    a1.fillMonthDays(day);
    expect(a1.getMonthDays()[0][5].day).toEqual(1);
    expect(a1.getMonthDays()[5][0].day).toEqual(31);

    a1.fillMonthDays(day.add(1, 'M'));
    expect(a1.getMonthDays()[0][1].day).toEqual(1);
    expect(a1.getMonthDays()[4][3].day).toEqual(31);

    a1.fillMonthDays(day.add(1, 'M'));
    a1.fillMonthDays(day.add(1, 'M'));
    a1.fillMonthDays(day.add(1, 'M'));
    a1.fillMonthDays(day.add(1, 'M'));
    a1.fillMonthDays(day.add(1, 'M')); // 1.1.2018
    expect(a1.getMonthDays()[0][0].day).toEqual(1);
    expect(a1.getMonthDays()[4][2].day).toEqual(31);
    expect(a1.getMonthDays()[4][3].day).toEqual(1);
    expect(a1.getMonthDays()[4][3].currentMonth).toBeFalsy();

});

it('listEvents', () => {
    expect(listToMatrix(['a', 'b', 'c', 'd'], 2)[1][1]).toEqual('d');
});

it('years', () => {
    let yearsMat = yearsMatrix(6);
    expect(yearsMat.length).toEqual(30);

    let numRow = findRowOfyear(yearsMat, 2018);
    expect(numRow).toEqual(16);
    expect(yearsMat[numRow][2]).toEqual(2018);

    /*const viewPortMaxLines = 6;
    expect(showYearInViewPort(yearsMat, viewPortMaxLines, 1920)).toBe(0);
    expect(showYearInViewPort(yearsMat, viewPortMaxLines, 1926)).toBe(0);
    expect(showYearInViewPort(yearsMat, viewPortMaxLines, 1932)).toBe(0);
    expect(showYearInViewPort(yearsMat, viewPortMaxLines, 1938)).toBe(1);
    expect(showYearInViewPort(yearsMat, viewPortMaxLines, 1944)).toBe(2);

    expect(vpMoveup(yearsMat, 0)).toBe(0);
    expect(vpMoveDown(yearsMat, 0)).toBe(1);
    expect(vpMoveDown(yearsMat, 29)).toBe(29);
    expect(vpMoveDown(yearsMat, 30)).toBe(29);

    expect(vpEndLine(yearsMat, 0, 6)).toBe(5);*/

});
