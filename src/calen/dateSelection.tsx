import * as React from 'react';
import { CalendarState, VIEW } from './redux/state';
import { CalendarDays } from './daySelection';
import { CalendarMonthSelect } from './monthSelection';
import { CalendarYearSelect } from './yearSelection';
import { Store } from './redux/dispatcher';

interface DateSelectionProps {
    info: CalendarState;
    dispatcher: Store;
}

export class DateSelection extends React.PureComponent<DateSelectionProps> {

    constructor(props: DateSelectionProps) {
        super(props);
    }

    render() {
        const view = this.props.info.currentView;
        return (
            <div className="dateSelection">
                {view === VIEW.DAY
                    ? < CalendarDays
                        localeCode={this.props.info.config.locale_code}
                        displayDate={this.props.info.displayDate}
                        selectedDate={this.props.info.selectedDateByUser}
                        dispatcher={this.props.dispatcher}
                    />
                    : (view === VIEW.MONTH_LIST
                        ? < CalendarMonthSelect info={this.props.info} dispatcher={this.props.dispatcher} />
                        : < CalendarYearSelect info={this.props.info} dispatcher={this.props.dispatcher} />)
                }
            </div>
        );
    }
}