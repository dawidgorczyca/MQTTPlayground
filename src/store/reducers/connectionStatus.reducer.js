import { CONNECTION_STATUS } from '../action.types'; 

const defaultState = {
  status: 'online'
}

const connectionStatusReducer = (state = defaultState, action) => {
  switch(action.type) {
    case CONNECTION_STATUS:
      return { ...state, status: action.status };
    default:
      return state;
  }
}

export default connectionStatusReducer;
