import mqtt from 'mqtt'
import {store} from '../containers/dashboard.container'
import {msg} from './reducers/tracking.reducer'
import {connectionStatus} from './reducers/connectionStatus.reducer'


function subscribeMQTT() {
  const client = mqtt.connect('mqtt://127.0.0.1:1887')

  client.on('connect',() =>{
    store.dispatch(connectionStatus('online'));
  })
  client.on('offline',() =>{
    store.dispatch(connectionStatus('offline'));
  })
  client.on('connect', () => {
    client.subscribe('/Tracking/+')
  })
  client.on('message', (topic, message) => {
    store.dispatch(msg(message.toString(), topic.split('/')[2]))
  })
}

export default subscribeMQTT