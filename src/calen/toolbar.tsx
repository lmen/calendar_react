import * as React from 'react';
import * as Mom from 'moment';

export class CalendarDDToolbar extends React.Component<{
    showBtns: boolean;
    monthDesc: string[];
    displayDate: Mom.Moment;
    onPrev?: () => void;
    onNext?: () => void;
    onBack?: () => void;
    onMonth?: () => void;
    onYear?: () => void;
}> {

    renderBtns() {
        return (
            <div className="buttons">
                <span className="fa fa-chevron-up next inline-link" onClick={this.props.onPrev} />
                <span className="fa fa-chevron-down prev inline-link" onClick={this.props.onNext} />
            </div>
        );
    }

    render() {
        const displayedMonthDesc = this.props.monthDesc[this.props.displayDate.month()];
        const displayedComp = this.props.displayDate.year();
        return (
            <div className="toolbar">
                <div className="one">
                    <span className="curMonth inline-link" onClick={this.props.onMonth} > {displayedMonthDesc} </span>
                    <span className="curYear inline-link" onClick={this.props.onYear}> {displayedComp}</span>
                </div>

                {this.props.onBack ?
                    <span
                        className="fa fa-level-up back inline-link"
                        onClick={this.props.onBack}
                        title="Back to day selection"
                    /> : false}

                {this.props.showBtns ? this.renderBtns() : false}

            </div>);
    }
}