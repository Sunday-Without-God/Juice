import 'babel-polyfill'
import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'
import routes from './routes'
import Root from './containers/Root'
import configureStore from './redux/configureStore'

const historyConfig = { basename: __BASENAME__ }
const browserHistory = useRouterHistory(createHistory)(historyConfig)

const initialState = window.__INITIAL_STATE__
const { store, history } = configureStore({ initialState, browserHistory })

injectTapEventPlugin()

if (__PROD__) {
  require('offline-plugin/runtime').install()
}

// Render the React application to the DOM
ReactDOM.render(
  <Root history={ history } routes={ routes } store={ store } />,
  document.getElementById('root')
)
