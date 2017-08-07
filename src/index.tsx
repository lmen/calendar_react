import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// import Hello from './containers/Hello';
/*import { createStore } from 'redux';
import { enthusiasm } from './reducers/reducers';
import { StoreState } from './types/index';
*/
// import { Provider } from 'react-redux';
// import { TimerView } from './mobx/comp';
// import appState from './mobx/test';
import { Form } from './form';

/*const store = createStore<StoreState>(enthusiasm, {
  enthusiasmLevel: 2,
  languageName: 'Typescript'
});
*/
/*<Provider store={store}>
    <Hello />
</Provider>,*/

ReactDOM.render(
  <Form />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
