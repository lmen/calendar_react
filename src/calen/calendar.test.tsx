// import * as enzyme from 'enzyme';
// import * as React from 'react';
import * as Mom from 'moment';
import {
    listToMatrix, yearsMatrix, findRowOfyear
} from './redux/utils';

import 'moment/locale/fr';
import 'moment/locale/pt';

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

    let day = Mom('01-08-2017', 'DD-MM-YYYY');
    let info = { year: day.year(), month: day.month(), day: 1 }; // month is zero based
    let firstDayOfDisplayMonth = Mom(info);
    firstDayOfDisplayMonth.locale('pt');
    expect(firstDayOfDisplayMonth.locale()).toBe('pt');
    expect(firstDayOfDisplayMonth.weekday()).toBe(1); // weekday is zero base
    expect(Mom.weekdays(true, 1)).toBe('dsds');
    expect(firstDayOfDisplayMonth.isoWeekday()).toBe(2); // with 1 being Monday, 2 Tuesday and 7 being Sunday.
    expect(firstDayOfDisplayMonth.format('DD-MM-YYYY')).toBe('dsds');

    // ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

    /*
        let a1 = new MonthDays('pt'); // Domingo = 0
        a1.fillMonthDays(day);
        expect(a1.getMonthDays()[0][0].day).toEqual(2);
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
    */
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

it('localization', () => {

    var mo = Mom.localeData('pt');
    expect(mo.months()[3]).toBe('Abril');
    expect(mo.monthsShort()[3]).toBe('Abr');
    expect(mo.weekdays()[3]).toBe('Quarta-Feira');
    expect(mo.weekdaysShort()[1]).toBe('Qua'); // 0 = DOM - ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    expect(mo.weekdaysMin()[3]).toBe('4ª');
    expect(mo.firstDayOfWeek()).toBe(1);
    expect(mo.weekdays()[mo.firstDayOfWeek()]).toBe('Segunda-Feira');

    var mofr = Mom.localeData('fr');
    expect(mofr.months()[3]).toBe('avril');
    expect(mofr.monthsShort()[3]).toBe('avr.');
    expect(mofr.weekdays()[3]).toBe('mercredi');
    expect(mofr.weekdaysShort()[3]).toBe('mer.');
    expect(mofr.weekdaysMin()[3]).toBe('Me');
    expect(mofr.firstDayOfWeek()).toBe(1);
    expect(mofr.weekdays()[mo.firstDayOfWeek()]).toBe('lundi');

    let info = { year: 2017, month: 9 - 1, day: 1 };
    let firstDayOfDisplayMonth = Mom(info);
    firstDayOfDisplayMonth.locale('pt');
    expect(firstDayOfDisplayMonth.locale()).toBe('pt'); // depends how the locate import order is done
    expect(firstDayOfDisplayMonth.isoWeekday()).toBe(2);
    expect(firstDayOfDisplayMonth.weekday()).toBe(1);
    expect(mo.weekdays()[firstDayOfDisplayMonth.weekday()]).toBe('Segunda-Feira');

});