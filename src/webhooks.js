const fetch = require('node-fetch')

class Webhooks {
  constructor (clients, config, logger) {
    this.clients = clients || []
    this.config = config
    this.logger = logger

    this.eventPool = []

    const sendInterval = this.config.get('sendEventsInterval')
    this.sendEventsInterval = setInterval(this.sendEvents.bind(this), sendInterval)
  }

  pushEvent (event) {
    this.eventPool.push(event)
  }

  sendToClient (client, events) {
    this.logger.info(`[Webhooks] Sending events to client ${client.service} (id: ${client.id}), count: ${events.length}`)

    fetch(
      client.endpoint,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Initiator-Service': this.config.get('initiatorServiceId'),
        },
        body: JSON.stringify(events),
      }
    ).catch(err => {
      this.logger.error(`[Webhooks] Error sending events to client ${client.service} (id: ${client.id}), reason: ${err.message}`, err)
    })
  }

  sendEvents () {
    if (!this.eventPool.length) {
      return
    }

    this.logger.info(`[Webhooks] Sending events start | event count: ${this.eventPool.length}`)

    const eventToSending = this.eventPool
    this.eventPool = []

    const clientsList = this.clients

    for (const client of clientsList) {
      const eventToClient = eventToSending.filter(event => client.events.indexOf(event.eventType) !== -1)

      if (eventToClient.length) {
        this.sendToClient(client, eventToClient)
      }
    }
  }
}

module.exports = Webhooks
