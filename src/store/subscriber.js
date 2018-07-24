import mqtt from 'mqtt'
import { store } from '../containers/dashboard.container'
import { subscriberUpdate } from './actions/subscriber.actions'
import {
  axiosDriversGet,
  axiosRoutesGet,
  axiosFencesGet
} from './actions/axios.actions'
import { connectionMqttStatus } from './actions/config.actions'


function subscribeMQTT() {
  const client = mqtt.connect('mqtt://localhost:1887')

  client.on('connect',() =>{
    store.dispatch(axiosDriversGet())
    store.dispatch(axiosRoutesGet())
    store.dispatch(axiosFencesGet())
    store.dispatch(connectionMqttStatus(true))
  })
  client.on('offline',() =>{
    store.dispatch(connectionMqttStatus(false))
  })
  client.on('connect', () => {
    client.subscribe('UPDATE/+/+')
  })
  client.on('message', (topic, message) => {
    store.dispatch(subscriberUpdate(topic, message.toString()))
  })
}

export default subscribeMQTT