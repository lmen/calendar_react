import * as React from 'react';
import { CalendarState } from './redux/state';
import { Store } from './redux/dispatcher';
import { CloseDropDownUserAcceptSelection, CloseDropDownUserReectSelection } from './redux/actions';
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
    }

    render() {
        const selectDate = this.props.info.selectedDateByUser;
        const css = `dropDown ${this.props.info.open ? 'show' : 'hide'}`;
        return (
            <div className={css}>
                <div className="currentSelectedDateZone" title="Selected date">
                    {!selectDate ? 'Please select a date' : selectDate.format('YYYY-MM-DD')}
                </div>
                <div className="selectionZone">
                    <DateSelection info={this.props.info} dispatcher={this.props.dispatcher} />
                    <TimeSelection timeState={this.props.info.timeSelection} dispatcher={this.props.dispatcher} />
                </div>
                <div className="btnsToolbar">
                    <button onClick={this.handleOk}> Ok </button>
                    <button onClick={this.handleCancel}> Cancel </button>
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

}