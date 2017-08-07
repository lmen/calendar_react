import * as React from 'react';
import { CalendarDDToolbar } from './toolbar';
import { CalendarState } from './redux/state';
import { CalendarDispatcher } from './redux/dispatcher';

interface CYearSelectProps {
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarYearSelect extends React.Component<CYearSelectProps> {

    private dispatcher: CalendarDispatcher;

    constructor(props: CYearSelectProps) {
        super(props);
        this.dispatcher = this.props.dispatcher;

        this.handleSelectedYear = this.handleSelectedYear.bind(this);
        this.handleScrollUp = this.handleScrollUp.bind(this);
        this.handleScrollDown = this.handleScrollDown.bind(this);
        this.handleGoDaysList = this.handleGoDaysList.bind(this);
        this.handleGoMonthsList = this.handleGoMonthsList.bind(this);
    }

    renderYear(year: number, isSelected: boolean, onYearSelected: (year: number) => void) {
        function intonYearSelected() {
            onYearSelected(year);
        }
        const css = isSelected ? 'yearSelected' : '';
        return (<td key={year} onClick={intonYearSelected} className={css}>{year}</td>);
    }

    render() {
        const yearsMat = this.props.info.yearsViewPort.content();
        return (
            <div className="cdrop">
                <CalendarDDToolbar
                    monthDesc={this.props.info.monthDesc}
                    showBtns={true}
                    displayDate={this.props.info.displayDate}
                    onNext={this.handleScrollDown}
                    onPrev={this.handleScrollUp}
                    onBack={this.handleGoDaysList}
                    onMonth={this.handleGoMonthsList}
                />
                <table className="yeartable">

                    <tbody>
                        {yearsMat.map((row, index) =>
                            <tr key={index}>
                                {row.map((d, ind) =>
                                    this.renderYear(d, this.isSelectedYear(d), this.handleSelectedYear)
                                )}
                            </tr>
                        )
                        }

                    </tbody>
                </table>
            </div>
        );

    }

    handleSelectedYear(year: number) {
        this.dispatcher.yearViewSelected(year);
    }

    handleScrollUp() {
        this.dispatcher.yearViewPortMoveUp();
    }

    handleScrollDown() {
        this.dispatcher.yearViewPortMoveDown();
    }

    handleGoDaysList() {
        this.dispatcher.showDaysView();
    }

    handleGoMonthsList() {
        this.dispatcher.showMonthsListView();
    }

    private isSelectedYear(year: number) {
        let yearSel = this.props.info.selectedDateByUser ? this.props.info.selectedDateByUser.year() : -1;
        return year === yearSel;
    }

}
