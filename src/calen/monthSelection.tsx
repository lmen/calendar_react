import * as React from 'react';
import { CalendarDDToolbar } from './toolbar';
import { CalendarState } from './redux/state';
import { listToMatrix } from './redux/utils';
import { CalendarDispatcher } from './redux/dispatcher';

interface CMonthSelectProps {
    info: CalendarState;
    dispatcher: CalendarDispatcher;
}

export class CalendarMonthSelect extends React.Component<CMonthSelectProps> {

    private dispatcher: CalendarDispatcher;

    constructor(props: CMonthSelectProps) {
        super(props);
        this.dispatcher = this.props.dispatcher;

        this.handleSelectedMonth = this.handleSelectedMonth.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleGoYearsList = this.handleGoYearsList.bind(this);
    }

    renderMonth(month: string, num: number, isSelected: boolean, onYearSelected: (month: number) => void) {
        function handleYearSelected() {
            onYearSelected(num);
        }
        const css = isSelected ? 'monthSelected' : '';
        return (<td key={month} onClick={handleYearSelected} className={css}>{month}</td>);
    }

    render() {
        const monthMatrix = listToMatrix(this.props.info.monthDesc, 4);
        return (
            <div className="cdrop">

                <CalendarDDToolbar
                    monthDesc={this.props.info.monthDesc}
                    showBtns={false}
                    displayDate={this.props.info.displayDate}
                    onBack={this.handleGoBack}
                    onYear={this.handleGoYearsList}
                />

                <table className="monthtable">
                    <tbody>
                        {monthMatrix.map((row, index) =>
                            <tr key={index}>
                                {row.map((desc, ind) => {
                                    let monthNum = (index * 4) + ind;
                                    let selected = this.isToSelectedMonth(monthNum);
                                    return this.renderMonth(desc, monthNum, selected, this.handleSelectedMonth);
                                })}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );

    }

    handleSelectedMonth(month: number) {
        this.dispatcher.monthViewSelected(month);
    }

    handleGoBack() {
        this.dispatcher.showDaysView();
    }

    handleGoYearsList() {
        this.dispatcher.showYearsListView();
    }

    private isToSelectedMonth(month: number): boolean {
        let monthSel = this.props.info.selectedDateByUser ? this.props.info.selectedDateByUser.month() : -1;
        return monthSel === month;
    }
}