import * as React from 'react';
import { CalendarState, VIEW } from './redux/state';
import { CalendarDays } from './daySelection';
import { CalendarMonthSelect } from './monthSelection';
import { CalendarYearSelect } from './yearSelection';
import { CalendarDispatcher } from './redux/dispatcher';

interface CDDownProps {
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarDropDown extends React.Component<CDDownProps> {

    renderDays() {
        return (
            < CalendarDays info={this.props.info} dispatcher={this.props.dispatcher} />
        );
    }

    renderMonthsList() {
        return (
            < CalendarMonthSelect info={this.props.info} dispatcher={this.props.dispatcher} />
        );
    }

    rendersYearsList() {
        return (
            < CalendarYearSelect info={this.props.info} dispatcher={this.props.dispatcher} />
        );
    }

    render() {
        const view = this.props.info.currentView;
        return ((view === VIEW.DAY ? this.renderDays() :
            (view === VIEW.MONTH_LIST ? this.renderMonthsList() : this.rendersYearsList()))
        );
    }

}