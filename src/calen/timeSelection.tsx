import * as React from 'react';
import { CalendarState } from './redux/state';
import { Store } from './redux/dispatcher';
import { ChangeTimeDisplayed, TimePartNames } from './redux/actions';

interface TimeSelectionProps {
    info: CalendarState;
    dispatcher: Store;
}

function lpad(n: number): string {
    return n < 10 ? '0' + n : Number(n).toString();
}

export class TimeSelection extends React.PureComponent<TimeSelectionProps> {

    constructor(props: TimeSelectionProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const displayDate = this.props.info.displayDate;
        const hour = lpad(displayDate.hour());
        const min = lpad(displayDate.minutes());
        // const seg = '09';
        const amPm = 'AM';
        const timeZone = 'Lisbon';

        return (

            <div className="timeSelectionZone">
                <table>
                    <tbody>
                        <tr>
                            <td onClick={this.handleClick} className="hour up">
                                <span className="fa fa-plus " />
                            </td>
                            <td><span /></td>
                            <td onClick={this.handleClick} className="min up">
                                <span className="fa fa-plus " />
                            </td>
                            <td><span /></td>
                            <td onClick={this.handleClick} className="amPm up">
                                <span className="fa fa-plus " />
                            </td>
                            <td onClick={this.handleClick} className="timezone up">
                                <span className="fa fa-plus " />
                            </td>
                        </tr>

                        <tr>
                            <td><span>{hour}</span></td>
                            <td><span>:</span></td>
                            <td><span>{min}</span></td>
                            <td><span /></td>
                            <td><span>{amPm}</span></td>
                            <td><span>{timeZone}</span></td>
                        </tr>

                        <tr>
                            <td onClick={this.handleClick} className="hour down">
                                <span className="fa fa-minus" />
                            </td>
                            <td><span /></td>
                            <td onClick={this.handleClick} className="min down">
                                <span className="fa fa-minus " />
                            </td>
                            <td><span /></td>
                            <td onClick={this.handleClick} className="amPm down">
                                <span className="fa fa-minus " />
                            </td>
                            <td onClick={this.handleClick} className="timezone down">
                                <span className="fa fa-minus " />
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        );
    }

    handleClick(evt: React.MouseEvent<HTMLTableCellElement>) {
        let current = evt.currentTarget;
        let classes = current.classList;
        if (classes.length !== 2) {
            return;
        }
        const partName = classes[0];
        const directions = classes[1];

        function convert(value: string): TimePartNames {

            if ('hour' === partName) {
                return TimePartNames.hour;
            }
            if ('min' === partName) {
                return TimePartNames.minutes;
            }
            return TimePartNames.hour;
        }

        let timePartName = convert(partName);
        let up = directions === 'up';
        this.props.dispatcher.apply(new ChangeTimeDisplayed(timePartName, up));
        console.log('click %s', classes);
    }
}