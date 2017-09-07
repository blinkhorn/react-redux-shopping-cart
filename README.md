# Super Simple Shopping Cart in Redux

We're going to build a very simple shopping cart that you can add items to. The complexity of the shopping cart app itself is minimal so as to help us get a feel for integrating Redux into a React app.

## Setup

Fork and clone down this repo.

By now, you should have [`create-react-app`](https://github.com/facebookincubator/create-react-app) installed on your computer via `npm`.

```bash
 $ create-react-app shopping-cart
 $ npm install redux react-redux
```

## Project Structuring

After we've installed these dependencies, let's create directories for `actions`, `components`, `reducers` and `stylesheets` in the `src` directory.

```bash
 $ mkdir src/components src/stylesheets
 $ touch src/actions.js src/reducers.js
 $ mv src/App.js src/components/App.js
 $ mv src/App.css src/index.css src/stylesheets/
```

Next, let's update the import paths for `App` in `index.js` to reflect the new locations of `App.js` and `App.css`.

Finally, we'll update the path for `index.css` in `index.js`.

## One Global Store

The first step we'll take in integrating Redux with React will be to define a store using `createStore` from `redux`.

Following the first principle of redux - [The state of your whole application is stored in an object tree within a single store.](http://redux.js.org/docs/introduction/ThreePrinciples.html#single-source-of-truth) - we import the `createStore` function from the `'redux'` module and the `Provider` component from the `'react-redux'` module into `index.js`. We will eventually use `createStore` to create the single global redux store.

This redux store won't be defined until we have provided to it a **reducer** function. This reducer function is responsible for taking the current `state` and any `action` and return a new state updated with that action. Reducers all have the signature `(state, action) => newState`. If a reducer doesn't know how to handle an action, it should just return the state unchanged. For now we will write the simplest possible reducer, `(state, action) => state` and provide that to the store.

In `src/reducers.js`

```js
export default (state, action) => state
```

We'll come back and expand this to handle our actions once we've defined them.

We will then pass this store to the `Provider` component from `'react-redux'`. The `Provider` component wraps the application and using react [magic*](http://redux.js.org/docs/basics/UsageWithReact.html#passing-the-store), passes state down to any child component that we have given the ability to receive it (using the [`connect` function](http://redux.js.org/docs/basics/UsageWithReact.html#implementing-container-components) from `'react-redux'`).

Now in `index.js` we have:

```js
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
```

### Aside: [Redux Devtools](https://github.com/gaearon/redux-devtools)
The `window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()` adds the chrome redux devtools middleware to the store. This will come in super handy when writing redux.

## Actions describing State Change

Recall the second principle of redux - [The only way to change the state is to emit an action, an object describing what happened.](http://redux.js.org/docs/introduction/ThreePrinciples.html#state-is-read-only). Next we will define two actions for our simple cart, `'ADD_ITEM'` and `'REMOVE_ITEM'`

### Adding Actions

NOTE: In a larger application we'd have an actions directory with action creators defined in domain specific files. See the [redux todos example](http://redux.js.org/docs/basics/ExampleTodoList.html). For the sake of navigability, we're putting everything in one.

In `src/actions.js`...

```js
// Action Creator function
// This action will be called from a button in the UI
export const addToCart = (item) => {
  return {
    // actions must have a type property
    type: 'ADD_ITEM', // action naming conventions: all caps with snake-case (JAVASCRIPT_CONSTANT naming convention )
    item // ES6 shorthand again {item: item}
  }
}

export const removeFromCart = (item) => {
  return {
    type: 'REMOVE_ITEM',
    item
  }
}
```

### Dispatching Actions from Components

Next we want to add the ability for the UI to dispatch actions. To do that, we'll need a UI. We are going to have two components in our UI, a `Shelf` which represents the user input for adding items to the cart and the `Cart` which holds selectedd items and gives the option to remove them. Our example will have some hardcoded state in `Shelf` which is not realistic to a `react-redux` app (one state) but helps us keep our redux interactions minimal.

Define the shelf as follows in `components/Shelf.js`

```js
import { Component } from 'react'

class Shelf extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shelfItems: [
        'Bananas',
        'Frozen Pizza',
        "Flamin' Hot Cheetos",
        'Arugula'
      ]
    }
  }

  render () {
    const shelfItems = this.state.shelfItems.map((item, id) => {
      return (
        <li key={id}>
          {item}
          <button onClick={() => this.props.addItem(item)}>+</button>
        </li>
      )
    })
    return (
      <div>
        <h2>Store Inventory</h2>
        <ul>
          {shelfItems}
        </ul>
      </div>
    )
  }
}

export default Shelf
```

Notice there is nothing special to `redux` here at all. Just an component with internal state that has one method provided by props `addItem` which gets called with a string.

`Shelf` is totally unaware of redux and will happily continue to be -- it does not depend on the global state, it gets everything it needs from props (igoring the internal state that is facilitating the example). This will be true of most of the components in a redux app, not directly interacting with the redux store but simply receiving its data and behavior from its parent.

The `Cart` component will be the parent of `Shelf` and will itself be connected to the redux store.

In this example we are blurring the lines between "presentational components" used for displaying data and calling functions provided by a parent and "container components" which connect to the store and pass data and functions to its children. Below are several very good articles on the conceptual distinction and the value of the destinction.

#### Presentational and Container Components

Before we continue coding, let's talk about how Redux interacts with container components and presentational components differently.

> From [Redux Docs: Presentational and Container Components](http://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components)

> Technically you could write the container components by hand using store.subscribe(). We don't advise you to do this because React Redux makes many performance optimizations that are hard to do by hand. For this reason, rather than write container components, we will generate them using the connect() function provided by React Redux, as you will see below.

![Comparing container components and presentational components in Redux](./lesson-images/redux-presentational-container-diffs.png)

> [Here's another resource from Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).

### Connecting Components

```bash
 $ touch src/components/Cart.js
```

In `src/components/Cart.js`...

```js
import React from 'react'
import { connect } from 'react-redux'

import {removeFromCart, addToCart} from '../actions'
import Shelf from './Shelf'

const Cart = (props) => {
  let cartItems = props.cart.map((item, id) => {
    return (
      <li key={id}>
        {item}
        <button onClick={() => props.dispatch(removeFromCart(item))}>-</button>
      </li>
    )
  })
  return (
    <div>
      <Shelf addItem={(item) => props.dispatch(addToCart(item))} />
      <h2>Cart</h2>
      <ol>
        {cartItems}
      </ol>
    </div>
  )
}

// Subscribes the component to any changes in Redux-managed state (the store)
// the Store's state is being mapped to, or passed into, the components as props
function mapStateToProps (state, props) {
  return {
    cart: state
  }
}

export default connect(mapStateToProps)(Cart)

// The line above does the following:
// 1. Pass mapStateToProps to the `connect` function from redux
//    This will return a function that will take your component and wrap it in a new component
// 2. This wrapper component defined by connect is how we get data from the redux store to
//    be accessible in the props (as defined by mapStateToProps) of our Cart component.
// 3. Connect will also provide a `dispatch` prop which is the store's dispatch method.
```

In `mapStateToProps`, is a function with two parameters, `state` and `props`. State is the global redux store and Props are the props passed by the parent of the wrapped component (`App` in our case). The `Cart` component will only be receiving props from redux so we don't use the `props` parameter in the body of `mapStateToProps`.

Next, we'll head over to `App.js` to add in our new component.

<details>
  <summary><strong>
    When do you need access to props?
  </strong></summary>

  <br>

  If we had some kind of information in `props` that was pertinent to the state.
  In the example below, our `props` corresponds to `ownProps`.
  <br>
  <img src="./lesson-images/mapState.png">
  <br>
  <a href="https://github.com/reactjs/react-redux/blob/master/docs/api.md#the-arity-of-mapstatetoprops-and-mapdispatchtoprops-determines-whether-they-receive-ownprops">
  mapStateToProps in Redux API Docs
  </a>

  > We are calling `mapStateToProps` `mapStoreStateToComponentProps` in this exercise so that the function's purpose is more clear

</details>

<br>

#### Adding Cart to App Component

In `components/App.js`...

```js
import React, { Component } from 'react'
import Cart from '../components/Cart'

import '../stylesheets/App.css'

class App extends Component {
  render() {
    return (
      <Cart />
    );
  }
}

export default App
```

## The Reducer

Recall the third principle of redux - [To specify how the state tree is transformed by actions, you write pure reducers.](http://redux.js.org/docs/introduction/ThreePrinciples.html#changes-are-made-with-pure-functions) - a reducer is just a function that takes the current state and an action and returns an new state (and does not mutate the old). This function is often described as having the _signature_ `(currentState, action) => newState`

`createStore` will take 2 arguments: the program's main reducer, the `rootReducer`, and optionally an initial state. The root reducer gets called with every action and the logic of the reducer function along with the type and any data of the action determines how state will be updated. If a reducer ever encounters an action with a type that it doesn't know how to handle, it should just return the state unchanged.

in `src/reducers.js`...

```js
function shoppingCartReducer (state = [], action) {
  return state
}

export default shoppingCartReducer
```

Let's build this out to handle adding items to the list:

```js
function shoppingCartReducer (state = [], action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return state.concat(action.item)
    default:
      return state
  }
}

export default shoppingCartReducer
```

We can test this out in the browser and start to explore the super neat redux devtools.

Let's add logic for removig an item:

```js
function shoppingCartReducer (state = [], action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return state.concat(action.item)
    case 'REMOVE_ITEM':
      const indx = state.indexOf(action.item)
      return state.filter((_, idx) => indx !== idx)
    default:
      return state
  }
}

export default shoppingCartReducer
```

### Structuring reducers

Like our collection of actions, this reducer is much smaller than anything more than a sample app would demand. Breaking up reducers is a much more envolved issue with great documentation [here](http://redux.js.org/docs/recipes/StructuringReducers.html).

## Redux Diagram
![Redux Diagram](https://camo.githubusercontent.com/e7921fdb62c3bab89005e090677a6cd07aceaa8c/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f434e50336b5953577741455672544a2e6a70673a6c61726765)
