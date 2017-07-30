import Hello from '../components/Hello';
import * as actions from '../actions';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';

// To component
export function mapStateToProps({ enthusiasmLevel, languageName }: StoreState) {
    return {
        enthusiasmLevel,
        name: languageName
    };
}

// From component
export function mapDispatchtoProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onIncrement: () => { dispatch(actions.incrementEnthusiasm()); },
        onDecrement: () => { dispatch(actions.decrementEnthusiasm()); }
    };
}

// create a new container component 
let a = connect(mapStateToProps, mapDispatchtoProps);
export default a(Hello as any);