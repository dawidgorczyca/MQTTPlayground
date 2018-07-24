import { mqttStatuses } from '../reducers/config.constants'

const {
  online,
  offline
} = mqttStatuses

export const configActionNames = {
  CONNECTION_STATUS: 'CONNECTION/UPDATE/mqttStatus'
}

export const connectionMqttStatus = (status) => ({
  type: configActionNames.CONNECTION_STATUS,
  status: status ? online : offline 
})