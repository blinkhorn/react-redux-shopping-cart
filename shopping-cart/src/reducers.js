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
