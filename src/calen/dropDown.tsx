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
        const currentState = this.props.info;
        const showDate = currentState.config.showDate;
        const showTime = currentState.config.showTime;
        const date = currentState.dateSelection.selectedDate;
        const time = currentState.timeSelection.timeSelected;
        let selectedDateTimeStr = currentState.config.selectedDataFormaterFn(date, time, currentState.config);
        const css = `dropDown ${currentState.open ? 'show' : 'hide'}`;
        return (
            <div className={css}>
                <div className="currentSelectedDateZone" title="Selected date">
                    {selectedDateTimeStr}
                </div>
                <div className="selectionZone">
                    {!showDate ? false :
                        <DateSelection info={this.props.info.dateSelection} dispatcher={this.props.dispatcher} />
                    }
                    {!showTime ? false :
                        <TimeSelection timeState={this.props.info.timeSelection} dispatcher={this.props.dispatcher} />
                    }
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