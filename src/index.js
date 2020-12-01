const WebhooksMaster = require('./webhooksMaster')
const EventBus = require('./eventBus')

const initWebhooksMaster = (clients, config) => {
  const webhooksMaster = new WebhooksMaster(clients, config)

  return webhooksMaster
}

const initEventBus = (config) => {
  const eventBus = new EventBus(config)

  return eventBus
}

module.exports = {
  webhooksMaster: initWebhooksMaster,
  eventBus: initEventBus,
}
