import * as React from 'react';
import { CalendarDDToolbar } from './toolbar';
import { DateSelectionState } from './redux/state';
import { Store } from './redux/dispatcher';
import {
    YearViewPortMoveDown, YearViewPortMoveUp,
    YearViewSelected, ShowDaysView, ShowMonthsListView
} from './redux/actions';
import { ViewPort } from './redux/utils';

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
    info: DateSelectionState;
    dispatcher: Store;
}

export class CalendarYearSelect extends React.PureComponent<CYearSelectProps> {

    private dispatcher: Store;

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
        let vp = new ViewPort(this.props.info.yearStartLine);
        let yearsMat = vp.content();
        return (
            <div className="view">
                <CalendarDDToolbar
                    localeCode={this.props.info.localeCode}
                    showBtns={true}
                    displayDate={this.props.info.displayDate}
                    onNext={this.handleScrollDown}
                    onPrev={this.handleScrollUp}
                    onBack={this.handleGoDaysList}
                    onMonth={this.handleGoMonthsList}
                />
                <table className="yearsView">

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
        this.dispatcher.apply(new YearViewSelected(year));
    }

    handleScrollUp() {
        this.dispatcher.apply(new YearViewPortMoveUp());
    }

    handleScrollDown() {
        this.dispatcher.apply(new YearViewPortMoveDown());
    }

    handleGoDaysList() {
        this.dispatcher.apply(new ShowDaysView());
    }

    handleGoMonthsList() {
        this.dispatcher.apply(new ShowMonthsListView());
    }

    private isSelectedYear(year: number) {
        let yearSel = this.props.info.selectedDate ? this.props.info.selectedDate.year : -1;
        return year === yearSel;
    }

}
