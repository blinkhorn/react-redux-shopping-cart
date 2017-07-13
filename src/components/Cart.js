import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as CartActions from '../actions/CartActions'

import Shelf from '../components/Shelf'

const Cart = (props) => {
  let cartItems = props.cart.map((item, id) => {
    return (
      <li key={id}>
        {item}
        <button onClick={() => props.actions.removeFromCart(id)}>-</button>
      </li>
    )
  })
  return (
    <div>
      <Shelf addItem={props.actions.addToCart}/>
      <h2>Cart</h2>
      <ol>
        {cartItems}
      </ol>
    </div>
  )
}


// More information about the implementation pattern below can be found at the link below
// https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options

//Subscribes the container component to any changes in Redux-managed state
function mapStoreStateToComponentProps(state, props) {
  return {
    cart: state.cart
  };
}

//Changes in our program will be reflected when new actions are dispatched
function mapDispatchToComponentProps(dispatch) {
  return {
    actions: bindActionCreators(CartActions, dispatch)
  }
}

// typically the lines below would be condensed into :
// export default connect(mapStateToProps, mapDispatchToProps)(Cart)

// returns a wrapper that we need to pass the component into
const connection = connect(
  mapStoreStateToComponentProps,
  mapDispatchToComponentProps
)

// wraps the component with the store connection configured above
const wrappedComponent = connection(Cart)

export default wrappedComponent
