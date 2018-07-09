import update from 'immutability-helper'

const MESSAGE = 'tracking/MSG'

export const msg = (recieved_msg) => ({
  type: MESSAGE,
  recieved_msg
})

const reducer = (state = {
  messages: []
}, action) => {
  switch(action.type) {
    case MESSAGE:
      return update(state, {
        messages: {$push: [action.recieved_msg] }
      })
    default:
      return state
  }
}

export default reducer