import * as React from 'react';

interface SpinerProps<K, U> {
    userData?: U;
    values: Value<K>[];
    initialSelectedKey?: K;
    onValueSelected?: (value: K, userData?: U) => void;
}

export class Spiner<K, U> extends React.PureComponent<SpinerProps<K, U>, SpinerState<K>> {

    constructor(props: SpinerProps<K, U>) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

        let s = new SpinerState(props.values);
        if (props.initialSelectedKey) {
            let ctrl = new SpinerCtrl(s);
            ctrl.selectKey(props.initialSelectedKey);
            s = ctrl.state;
        }

        this.state = s;
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        let ctrl = new SpinerCtrl(this.state);
        let label = ctrl.getLabelFromSelected();
        return (
            <table>
                <tbody>
                    <tr>
                        {this.renderUp()}
                    </tr>

                    <tr>
                        {this.renderValue(label)}
                    </tr>
                    <tr>
                        {this.renderDown()}
                    </tr>
                </tbody>
            </table>
        );
    }

    handleClick(evt: React.MouseEvent<HTMLTableCellElement>) {
        let current = evt.currentTarget;
        let classes = current.classList;
        if (classes.length !== 1) {
            return;
        }
        const directions = classes[0];

        // change state
        let ctrl = new SpinerCtrl(this.state);
        if ('up' === directions) {
            ctrl.moveUp();
        } else {
            ctrl.moveDown();
        }
        this.setState(ctrl.state);

        // inform parent about a new value has change
        if (this.props.onValueSelected) {
            const key = ctrl.getKeyFromSelected();
            this.props.onValueSelected(key, this.props.userData);
        }

        console.log('click %s', classes);
    }

    private renderValue(value: string = '') {
        return (
            <td><span />{value}</td>
        );
    }

    private renderUp() {
        return (
            <td onClick={this.handleClick} className="up">
                <span className="fa fa-plus" />
            </td>
        );
    }

    private renderDown() {
        return (
            <td onClick={this.handleClick} className="down">
                <span className="fa fa-minus" />
            </td>
        );
    }
}

export class Value<K> {
    key: K;
    label: string;
}

class SpinerState<K> {
    currentIndex: number;

    constructor(public readonly values: Value<K>[]) {
        this.currentIndex = 0;
    }
}

class SpinerCtrl<K> {

    public state: SpinerState<K>;

    constructor(oldState: SpinerState<K>) {
        this.state = new SpinerState(oldState.values);
        this.state.currentIndex = oldState.currentIndex;
    }

    selectKey(key: K): void {
        this.state.values.find((v) => v.key === key);
    }

    moveUp(): void {
        this.state.currentIndex++;
        if (this.state.currentIndex >= this.state.values.length) {
            this.state.currentIndex = 0;
        }
    }

    moveDown(): void {
        this.state.currentIndex--;
        if (this.state.currentIndex < 0) {
            this.state.currentIndex = this.state.values.length - 1;
        }
    }

    getLabelFromSelected(): string {
        return this.state.values[this.state.currentIndex].label;
    }

    getKeyFromSelected(): K {
        return this.state.values[this.state.currentIndex].key;
    }

}