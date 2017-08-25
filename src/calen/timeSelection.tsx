import * as React from 'react';
import { CalendarState } from './redux/state';
import { Store } from './redux/dispatcher';
import { ChangeTimeDisplayed, TimePartNames } from './redux/actions';
import { AM_PM_VALUES, TIME_ZONE_VALUES, MinutesSeconds, Hours24, HoursAmPm } from './redux/utils';
import { Spiner } from './spiner';

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
        /*      const hideAmPm = this.props.info.timeSelection.mode24Hours;
              const hideTimeZone = !this.props.info.timeSelection.showTimeZone;
              const hideSeconds = !this.props.info.timeSelection.showSeconds;
              const displayDate = this.props.info.displayDate;
      
              let screen = new MomentToSceen(displayDate, !hideAmPm);
              const hour = screen.hour;
              const min = screen.min;
              const seconds = screen.seconds;
      */
        // const amPm = AM_PM_VALUES[this.props.info.timeSelectionAmPmIndex];
        // const timeZone = TIME_ZONE_VALUES[this.props.info.timeSelectionTimeZoneIndex];

        return (

            <div className="timeSelectionZone">

                <Spiner values={Hours24} onValueSelected={this.handleClick} userData="hour" />
                <Spiner values={HoursAmPm} onValueSelected={this.handleClick} userData="hourAmPm" />
                <div className="separator">:</div>
                <Spiner values={MinutesSeconds} onValueSelected={this.handleClick} userData="min" />
                <div className="separator">:</div>
                <Spiner values={MinutesSeconds} onValueSelected={this.handleClick} userData="sec" />
                <Spiner values={AM_PM_VALUES} onValueSelected={this.handleClick} userData="amPm" />
                <Spiner values={TIME_ZONE_VALUES} onValueSelected={this.handleClick} userData="zones" />

                {/*
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
*/}
            </div>
        );
    }

    handleClick(key: string, partName: string) {

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
            if ('zones' === partName) {
                return TimePartNames.timeZone;
            }
            return TimePartNames.hour;
        }

        let timePartName = convert(partName);
        let up = true;
        this.props.dispatcher.apply(new ChangeTimeDisplayed(timePartName, up));
        console.log('click %s - %s', key, partName);
    }
    /*
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
        */
}
