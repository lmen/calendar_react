import * as React from 'react';
import { TimeSelectionState } from './redux/state';

import { Store } from './redux/dispatcher';
import { ChangeTimeDisplayed, TimePartNames } from './redux/actions';
import { AM_PM_VALUES, TIME_ZONE_VALUES, MinutesSeconds, Hours24, HoursAmPm } from './redux/utils';
import { Spiner } from './spiner';

interface TimeSelectionProps {
    timeState: TimeSelectionState;
    dispatcher: Store;
}

export class TimeSelection extends React.PureComponent<TimeSelectionProps> {

    constructor(props: TimeSelectionProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        let info = this.props.timeState;
        const hideAmPm = info.mode24Hours;
        const hideTimeZone = !info.showTimeZone;
        const hideSeconds = !info.showSeconds;
        const timeToDisplay = info.timeDisplayed;

        return (

            <div className="timeSelectionZone">

                {

                    // hour
                }
                {hideAmPm ?
                    <Spiner
                        values={Hours24}
                        onValueSelected={this.handleClick}
                        userData={TimePartNames.hour}
                        initialSelectedKey={timeToDisplay.hour}
                    />
                    :
                    <Spiner
                        values={HoursAmPm}
                        onValueSelected={this.handleClick}
                        userData={TimePartNames.hour}
                        initialSelectedKey={timeToDisplay.hour}
                    />
                }

                {
                    // mins
                }
                <div className="separator">:</div>
                <Spiner
                    values={MinutesSeconds}
                    onValueSelected={this.handleClick}
                    userData={TimePartNames.minutes}
                    initialSelectedKey={timeToDisplay.min}
                />

                {

                    // seconds is optional
                }
                {hideSeconds ? false : (<div className="separator">:</div>)}
                {
                    hideSeconds ? false : (
                        <Spiner
                            values={MinutesSeconds}
                            onValueSelected={this.handleClick}
                            userData={TimePartNames.seconds}
                            initialSelectedKey={timeToDisplay.sec}
                        />
                    )
                }

                {
                    // AM/Pm optional
                }
                {
                    hideAmPm ? false :
                        <Spiner
                            values={AM_PM_VALUES}
                            onValueSelected={this.handleClick}
                            userData={TimePartNames.amPm}
                            initialSelectedKey={AM_PM_VALUES[timeToDisplay.isAm ? 0 : 1].key}
                        />
                }

                {
                    // TimeZone - optional
                }
                {hideTimeZone ? false :
                    <Spiner
                        values={TIME_ZONE_VALUES}
                        onValueSelected={this.handleClick}
                        userData={TimePartNames.timeZone}
                        initialSelectedKey={timeToDisplay.timeZone}
                    />
                }

            </div>
        );
    }

    handleClick(key: string, partName: TimePartNames) {
        console.log('click %s - %s', key, partName);
        this.props.dispatcher.apply(new ChangeTimeDisplayed(partName, key));
    }
}
