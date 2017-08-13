import * as React from 'react';
import { CalendarState, VIEW } from './redux/state';
import { CalendarDays } from './daySelection';
import { CalendarMonthSelect } from './monthSelection';
import { CalendarYearSelect } from './yearSelection';
import { Store } from './redux/dispatcher';
import { CloseDropDown } from './redux/actions';

interface CDDownProps {
    info: CalendarState;
    dispatcher: Store;
}

export class CalendarDropDown extends React.PureComponent<CDDownProps> {

    constructor(props: CDDownProps) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    render() {
        const view = this.props.info.currentView;
        const selectDate = this.props.info.selectedDateByUser;
        const css = `dropDown ${this.props.info.open ? 'show' : 'hide'}`;
        return (
            <div className={css}>
                <div className="currentSelectedDate">
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
                <div className="btnsToolbar">
                    <button onClick={this.handleOk}> Ok </button>
                    <button onClick={this.handleCancel}> Cancel </button>
                </div>
            </div>
        );
    }

    handleOk() {
        this.props.dispatcher.apply(new CloseDropDown());
    }

    handleCancel() {
        this.props.dispatcher.apply(new CloseDropDown());
    }

}