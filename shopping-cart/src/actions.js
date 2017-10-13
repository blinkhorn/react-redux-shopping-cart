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
