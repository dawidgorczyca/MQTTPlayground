import objectAssign from '../../../../../Library/Caches/typescript/2.9/node_modules/@types/object-assign'

const CONNECTION_STATUS = 'connection/status'

export const connectionStatus = (status) => ({
  type: CONNECTION_STATUS,
  status
})

const defaultState = {
  status: 'online'
}

const connectionStatusReducer = (state = defaultState, action) => {
  switch(action.type) {
    case CONNECTION_STATUS:
      return objectAssign( {}, state, { status: action.status } );
    default:
      return state
  }
}

export default connectionStatusReducer