import { observer } from 'mobx-react';
import { AppState } from './test';
import * as React from 'react';

interface CProps {
    appState: AppState;
}

@observer
export class TimerView extends React.Component<CProps> {

    constructor(props: CProps) {
        super(props);
        this.onReset = this.onReset.bind(this);
    }

    render() {
        return (
            <button onClick={this.onReset}>
                Seconds passed: {this.props.appState.timer}
            </button>
        );
    }

    onReset() {
        this.props.appState.reset(); // timer++;
    }
}