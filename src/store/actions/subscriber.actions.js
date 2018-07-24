export const subActionNames = {
  SUBSCRIBER_UPDATE: 'SUBSCRIBER/UPDATE'
}

export const subscriberUpdate = (topic, payload) => ({
  type: subActionNames.SUBSCRIBER_UPDATE,
  topic,
  payload: JSON.parse(payload)
})