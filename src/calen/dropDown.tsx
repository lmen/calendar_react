import * as React from 'react';
import { CalendarState } from './redux/state';
import { Store } from './redux/dispatcher';
import { CloseDropDownUserAcceptSelection, CloseDropDownUserReectSelection, ClearUserSelection } from './redux/actions';
import { DateSelection } from './dateSelection';
import { TimeSelection } from './timeSelection';

interface CDDownProps {
    info: CalendarState;
    dispatcher: Store;
}

export class CalendarDropDown extends React.PureComponent<CDDownProps> {

    constructor(props: CDDownProps) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    render() {
        console.log('render calendar Drop Down');

        const date = this.props.info.dateSelection.selectedDate;
        const time = this.props.info.timeSelection.timeSelected;
        let selectedDateTimeStr = !date ? 'Please select a date' : (
            date.year + '-' + date.month + '-' + date.day);
        if (time) {
            selectedDateTimeStr += ' ' + time.hour + ':' + time.min + (time.sec ? ':' + time.sec : '');
        }
        const css = `dropDown ${this.props.info.open ? 'show' : 'hide'}`;
        return (
            <div className={css}>
                <div className="currentSelectedDateZone" title="Selected date">
                    {selectedDateTimeStr}
                </div>
                <div className="selectionZone">
                    <DateSelection info={this.props.info.dateSelection} dispatcher={this.props.dispatcher} />
                    <TimeSelection timeState={this.props.info.timeSelection} dispatcher={this.props.dispatcher} />
                </div>
                <div className="btnsToolbar">
                    <button onClick={this.handleOk}> Ok </button>
                    <button onClick={this.handleCancel}> Cancel </button>
                    <button onClick={this.handleClear}> Clear </button>
                </div>
            </div>
        );
    }

    handleOk() {
        this.props.dispatcher.apply(new CloseDropDownUserAcceptSelection());
    }

    handleCancel() {
        this.props.dispatcher.apply(new CloseDropDownUserReectSelection());
    }

    public handleClear(): void {
        this.props.dispatcher.apply(new ClearUserSelection());
    }

}