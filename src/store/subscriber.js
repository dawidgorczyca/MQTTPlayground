import mqtt from 'mqtt'
import {store} from '../containers/dashboard.container'
import {msg} from './reducers/tracking.reducer'
import {connectionStatus} from './reducers/connectionStatus.reducer'


function subscribeMQTT() {
  const client = mqtt.connect('mqtt://localhost:1887')

  client.on('connect',() =>{
    store.dispatch(connectionStatus('online'))
  })
  client.on('offline',() =>{
    store.dispatch(connectionStatus('offline'))
  })
  client.on('connect', () => {
    client.subscribe('UPDATE/+/+')
  })
  client.on('message', (topic, message) => {
    console.log(topic, JSON.parse(message.toString()))
    store.dispatch(msg(message.toString(), topic.split('/')[2]))
  })
}

export default subscribeMQTT