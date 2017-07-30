import * as enzyme from 'enzyme';
// import * as React from 'react';
import * as Mom from 'moment';
import { MonthDays } from './data';

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

    let a1 = new MonthDays();
    a1.fillMonthDays(2017, 2);
    expect(a1.getMonthDays()).toEqual([26, 27, 28, 29, 30, 31]);

});