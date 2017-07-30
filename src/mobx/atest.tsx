import { observable, action } from 'mobx';

export interface AppState {
    timer: number;
    reset(): void;
}

let ins: AppState = {
    timer: 0,
    reset: action(() => { console.log('dentro %s', appState.timer); appState.timer--; })
};

var appState = observable(ins);

export default appState;