import * as React from 'react';
import './Hello.css';
import { ReactNode } from 'react-redux';

export interface HelloProps {
    name: string;
    enthusiasmLevel?: number;

    onIncrement?: () => void;
    onDecrement?: () => void;

    children?: ReactNode;
}

export default class Hello extends React.Component<HelloProps> {

    constructor(props: HelloProps) {
        super(props);
        if (props.enthusiasmLevel !== undefined && props.enthusiasmLevel <= 0) {
            throw new Error('you could be a little more enthusiastic. :D');
        }

    }

    getExclamationMarks(num: number | undefined) {
        return Array((num ? num : 1) + 1).join('!');
    }

    render() {
        return (
            <div className="hello" >
                <div className="greeting" >
                    Hello {this.props.name + this.getExclamationMarks(this.props.enthusiasmLevel)}
                </div >
                <div >
                    <button onClick={this.props.onIncrement}>+</button >
                    <button onClick={this.props.onDecrement}>-</button >
                </div >
            </div >
        );
    }

}