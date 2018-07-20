import axios from 'axios'

export default store => next => (action) => {
  if(action.type.startsWith('axios/')){
    const { method, url } = action.payload;
    axios({
      method: method,
      url: `http://localhost:8080${url}`,
    })
    .then(( response ) => {
      store.dispatch({
        type: `RESPONSE/${action.type}`,
        payload: {
          data: response.data,
          entityId: action.payload.entityId
        }
      })
    })
  }
  next(action)
}