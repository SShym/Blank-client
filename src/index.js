import './index.css';
import thunk from 'redux-thunk';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createStore, compose, applyMiddleware} from 'redux';
import { reducers } from './redux/reducers';
import { Provider } from 'react-redux';
import GlobalContextProvider from "./Components/styles/globalContext";

const store = createStore(reducers, compose(
  applyMiddleware(
    thunk,
  ),
));

ReactDOM.render(
    <Provider store = {store}>
      <GlobalContextProvider>
          <App />
      </GlobalContextProvider>
    </Provider>,
  document.getElementById('root')
);