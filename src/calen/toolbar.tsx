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
                <span className="nextMonth" onClick={this.props.onPrev}> &lt; </span>
                <span className="prevMonth" onClick={this.props.onNext}> &gt; </span>
            </div>
        );
    }

    render() {
        const displayedMonthDesc = this.props.monthDesc[this.props.displayDate.month()];
        const displayedComp = this.props.displayDate.year();
        return (
            <div className="zone">
                <div className="one">
                    <span className="curMonth" onClick={this.props.onMonth} > {displayedMonthDesc} </span>
                    <span className="curYear" onClick={this.props.onYear}> {displayedComp}</span>
                </div>

                {this.props.onBack ? <span className="back" onClick={this.props.onBack}> * </span> : false}
                {this.props.showBtns ? this.renderBtns() : false}

            </div>);
    }
}