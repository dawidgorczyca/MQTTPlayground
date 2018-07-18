import mqtt from 'mqtt'
import {store} from '../App'
import {msg} from './reducers/tracking.reducer'
import {connectionStatus} from './reducers/connectionStatus.reducer'


function subscribeMQTT() {
  const client = mqtt.connect('mqtt://mqtt.broker.gkasperski.usermd.net:1884')

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
    console.log(topic, message)
    store.dispatch(msg(message.toString(), topic.split('/')[2]))
  })
}

export default subscribeMQTT