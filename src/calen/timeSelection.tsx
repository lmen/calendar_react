import * as React from 'react';
import { CalendarState, AM_PM_VALUES, TIME_ZONE_VALUES } from './redux/state';
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
        const seconds = lpad(displayDate.seconds());
        // const seg = '09';
        const amPm = AM_PM_VALUES[this.props.info.timeSelectionAmPmIndex];
        const timeZone = TIME_ZONE_VALUES[this.props.info.timeSelectionTimeZoneIndex];
        const hideAmPm = this.props.info.timeSelection24Hours;
        const hideTimeZone = !this.props.info.timeSelectionShowTimeZone;
        const hideSeconds = !this.props.info.timeSelectionShowSeconds;

        return (

            <div className="timeSelectionZone">
                <table>
                    <tbody>
                        <tr>
                            {this.renderUp('hour')}
                            {this.renderValue()}
                            {this.renderUp('min')}
                            {this.renderValue('', hideSeconds)}
                            {this.renderUp('sec', hideSeconds)}
                            {this.renderValue()}
                            {this.renderUp('amPm', hideAmPm)}
                            {this.renderUp('timezone', hideTimeZone)}
                        </tr>

                        <tr>
                            {this.renderValue(hour)}
                            {this.renderValue(':')}
                            {this.renderValue(min)}
                            {this.renderValue(':', hideSeconds)}
                            {this.renderValue(seconds, hideSeconds)}
                            {this.renderValue()}
                            {this.renderValue(amPm, hideAmPm)}
                            {this.renderValue(timeZone, hideTimeZone)}
                        </tr>

                        <tr>
                            {this.renderDown('hour')}
                            {this.renderValue()}
                            {this.renderDown('min')}
                            {this.renderValue('', hideSeconds)}
                            {this.renderDown('sec', hideSeconds)}
                            {this.renderValue()}
                            {this.renderDown('amPm', hideAmPm)}
                            {this.renderDown('timezone', hideTimeZone)}
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
            if ('sec' === partName) {
                return TimePartNames.seconds;
            }
            if ('amPm' === partName) {
                return TimePartNames.amPm;
            }
            if ('timezone' === partName) {
                return TimePartNames.timeZone;
            }
            return TimePartNames.hour;
        }

        let timePartName = convert(partName);
        let up = directions === 'up';
        this.props.dispatcher.apply(new ChangeTimeDisplayed(timePartName, up));
        console.log('click %s', classes);
    }

    private renderValue(value: string = '', hide: boolean = false) {
        return hide ? false : (<td><span />{value}</td>);
    }

    private renderUp(name: string, hide: boolean = false) {
        const css = name + ' up';
        return hide ? false :
            (
                <td onClick={this.handleClick} className={css}>
                    <span className="fa fa-plus" />
                </td>
            );
    }

    private renderDown(name: string, hide: boolean = false) {
        const css = name + ' down';
        return hide ? false :
            (
                <td onClick={this.handleClick} className={css}>
                    <span className="fa fa-minus" />
                </td>
            );
    }
}