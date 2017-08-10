import * as React from 'react';
import { CalendarState, VIEW } from './redux/state';
import { CalendarDays } from './daySelection';
import { CalendarMonthSelect } from './monthSelection';
import { CalendarYearSelect } from './yearSelection';
import { Store } from './redux/dispatcher';

interface CDDownProps {
    info: CalendarState;
    dispatcher: Store;
}

export class CalendarDropDown extends React.PureComponent<CDDownProps> {

    render() {
        const view = this.props.info.currentView;
        const selectDate = this.props.info.selectedDateByUser;
        return (
            <div className="dropDown">
                <div className="">
                    {!selectDate ? 'Select a date' : selectDate.format('YYYY-MM-DD')}
                </div>
                <div className="viewZone">
                    {view === VIEW.DAY
                        ? < CalendarDays
                            displayDate={this.props.info.displayDate}
                            selectedDate={this.props.info.selectedDateByUser}
                            monthDesc={this.props.info.monthDesc}
                            dispatcher={this.props.dispatcher}
                        />
                        : (view === VIEW.MONTH_LIST
                            ? < CalendarMonthSelect info={this.props.info} dispatcher={this.props.dispatcher} />
                            : < CalendarYearSelect info={this.props.info} dispatcher={this.props.dispatcher} />)
                    }
                </div>
            </div>
        );
    }

}