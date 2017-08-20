import * as React from 'react';
import * as Mom from 'moment';
import { localeListOfMonths } from './redux/utils';

export class CalendarDDToolbar extends React.Component<{
    showBtns: boolean;
    localeCode: string;
    displayDate: Mom.Moment;
    onPrev?: () => void;
    onNext?: () => void;
    onBack?: () => void;
    onMonth?: () => void;
    onYear?: () => void;
}> {

    renderBtns() {
        return (
            <div className="right-zone">
                <span className="fa fa-chevron-up next inline-link" onClick={this.props.onPrev} />
                <span className="fa fa-chevron-down prev inline-link" onClick={this.props.onNext} />
            </div>
        );
    }

    render() {
        const displayedMonthDesc = localeListOfMonths(this.props.localeCode)[this.props.displayDate.month()];
        const displayedYear = this.props.displayDate.year();
        return (
            <div className="toolbar">
                <div className="left-zone">
                    <span className="curMonth inline-link" onClick={this.props.onMonth} > {displayedMonthDesc} </span>
                    <span className="curYear inline-link" onClick={this.props.onYear}> {displayedYear}</span>
                    {this.props.onBack ?
                        <span
                            className="fa fa-calendar back inline-link"
                            onClick={this.props.onBack}
                            title="Goto day selection"
                        /> : false}
                </div>

                {this.props.showBtns ? this.renderBtns() : false}

            </div>);
    }
}