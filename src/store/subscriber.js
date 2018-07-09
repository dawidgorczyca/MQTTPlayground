import mqtt from 'mqtt'
import {store} from '../App'
import {msg} from './reducers/tracking.reducer'


function subscribeMQTT() {
  const client = mqtt.connect('mqtt://localhost:1884')

  client.on('connect', () => {
    client.subscribe('/Tracking/+')
  })
  client.on('message', (topic, message) => {
    store.dispatch(msg(message.toString(), topic.split('/')[2]))
  })
}

export default subscribeMQTT