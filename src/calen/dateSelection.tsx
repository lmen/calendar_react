import * as React from 'react';
import { VIEW, DateSelectionState } from './redux/state';
import { CalendarDays } from './daySelection';
import { CalendarMonthSelect } from './monthSelection';
import { CalendarYearSelect } from './yearSelection';
import { Store } from './redux/dispatcher';

interface DateSelectionProps {
    info: DateSelectionState;
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
                        localeCode={this.props.info.localeCode}
                        displayDate={this.props.info.displayDate}
                        selectedDate={this.props.info.selectedDate}
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