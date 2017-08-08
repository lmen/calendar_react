import * as React from 'react';
import { CalendarDDToolbar } from './toolbar';
import { CalendarState } from './redux/state';
import { CalendarDispatcher } from './redux/dispatcher';

interface Props {
    year: number;
    isSelected: boolean;
    onYearSelected: (year: number) => void;
}

export class Year extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);

        this.handleYearSelected = this.handleYearSelected.bind(this);
    }

    handleYearSelected() {
        this.props.onYearSelected(this.props.year);
    }

    render() {
        console.log('render Year %s', this.props.year);
        const css = this.props.isSelected ? 'yearSelected' : '';

        return (
            <td
                onClick={this.handleYearSelected}
                className={css}
            >
                {this.props.year}
            </td>);
    }

}

interface CYearSelectProps {
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarYearSelect extends React.PureComponent<CYearSelectProps> {

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

    render() {
        console.log('render CalendarYearSelect');

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
                                    <Year
                                        key={d.toString()}
                                        year={d}
                                        isSelected={this.isSelectedYear(d)}
                                        onYearSelected={this.handleSelectedYear}
                                    />
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
