import * as React from 'react';
import { CalendarState } from './redux/state';
import { Store } from './redux/dispatcher';

interface TimeSelectionProps {
    info: CalendarState;
    dispatcher: Store;
}

export class TimeSelection extends React.PureComponent<TimeSelectionProps> {

    constructor(props: TimeSelectionProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const displayDate = this.props.info.displayDate;
        const hour = displayDate.hour();
        const min = displayDate.minutes();
        // const seg = '09';
        const amPm = 'AM';
        const timeZone = 'Lisbon';

        return (

            <div className="timeSelectionZone">
                <table>
                    <tbody>
                        <tr>
                            <td onClick={this.handleClick} className="hour up"><span className="fa fa-caret-up " /></td>
                            <td><span /></td>
                            <td onClick={this.handleClick} className="min up"><span className="fa fa-caret-up " /></td>
                            <td><span /></td>
                            <td onClick={this.handleClick} className="amPm up"><span className="fa fa-caret-up " /></td>
                            <td onClick={this.handleClick} className="timezone up">
                                <span className="fa fa-caret-up " />
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
                                <span className="fa fa-caret-down" />
                            </td>
                            <td><span /></td>
                            <td onClick={this.handleClick} className="min down">
                                <span className="fa fa-caret-down " />
                            </td>
                            <td><span /></td>
                            <td onClick={this.handleClick} className="amPm down">
                                <span className="fa fa-caret-down " />
                            </td>
                            <td onClick={this.handleClick} className="timezone down">
                                <span className="fa fa-caret-down " />
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
        this.props.dispatcher.apply(new ChangeTimeDisplayed());
        console.log('click %s', classes);
    }
}