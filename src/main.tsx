import React from 'react';// Импортируем React
import ReactDOM from 'react-dom'; 
import App from './App';
import store from './ReduxToolkit/store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')!
);
