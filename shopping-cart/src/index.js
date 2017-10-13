import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import shoppingCartApp from './reducers'
import './stylesheets/index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

const store = createStore(
  shoppingCartApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'))

registerServiceWorker()
