import * as React from 'react';
import { CalendarDDToolbar } from './toolbar';
import { CalendarState } from './redux/state';
import { listToMatrix, localeListOfMonthsShort } from './redux/utils';
import { Store } from './redux/dispatcher';
import { MonthViewSelected, ShowDaysView, ShowYearsListView } from './redux/actions';

interface Props {
    month: string;
    num: number;
    isSelected: boolean;
    onMonthSelected: (month: number) => void;
}

class Month extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);
        this.handleYearSelected = this.handleYearSelected.bind(this);
    }

    handleYearSelected() {
        this.props.onMonthSelected(this.props.num);
    }

    render() {
        console.log('render Month %s', this.props.num);

        const css = this.props.isSelected ? 'monthSelected' : '';
        return (<td onClick={this.handleYearSelected} className={css}>{this.props.month}</td>);
    }

}

interface CMonthSelectProps {
    info: CalendarState;
    dispatcher: Store;
}

export class CalendarMonthSelect extends React.PureComponent<CMonthSelectProps> {

    private dispatcher: Store;

    constructor(props: CMonthSelectProps) {
        super(props);
        this.dispatcher = this.props.dispatcher;

        this.handleSelectedMonth = this.handleSelectedMonth.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleGoYearsList = this.handleGoYearsList.bind(this);
    }

    render() {
        console.log('Render MonthSelection');
        const monthDesc = localeListOfMonthsShort(this.props.info.config.locale_code);
        const monthMatrix = listToMatrix(monthDesc, 4);
        return (
            <div className="view">

                <CalendarDDToolbar
                    localeCode={this.props.info.config.locale_code}
                    showBtns={false}
                    displayDate={this.props.info.displayDate}
                    onBack={this.handleGoBack}
                    onYear={this.handleGoYearsList}
                />

                <table className="monthsView">
                    <tbody>
                        {monthMatrix.map((row, index) =>
                            <tr key={index}>
                                {row.map((desc, ind) => {
                                    let monthNum = (index * 4) + ind;
                                    let selected = this.isToSelectedMonth(monthNum);
                                    return (
                                        <Month
                                            key={desc}
                                            month={desc}
                                            num={monthNum}
                                            isSelected={selected}
                                            onMonthSelected={this.handleSelectedMonth}
                                        />
                                    );
                                })}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );

    }

    handleSelectedMonth(month: number) {
        this.dispatcher.apply(new MonthViewSelected(month));
    }

    handleGoBack() {
        this.dispatcher.apply(new ShowDaysView());
    }

    handleGoYearsList() {
        this.dispatcher.apply(new ShowYearsListView());
    }

    private isToSelectedMonth(month: number): boolean {
        let monthSel = this.props.info.selectedDateByUser ? this.props.info.selectedDateByUser.month() : -1;
        return monthSel === month;
    }
}