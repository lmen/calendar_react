import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

it('renders without crashings', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
