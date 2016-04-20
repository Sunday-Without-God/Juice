import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import routes from './routes';
import Root from './containers/Root';
import configureStore from './redux/configureStore';
import 'expose?Perf!react-addons-perf';

const historyConfig = { basename: __BASENAME__ };
const browserHistory = useScroll(useRouterHistory(createHistory))(historyConfig);

const initialState = window.__INITIAL_STATE__;
const { store, history } = configureStore({ initialState, browserHistory });

injectTapEventPlugin();

// Render the React application to the DOM
ReactDOM.render(
  <Root history={ history } routes={ routes } store={ store } />,
  document.getElementById('root')
);
