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
