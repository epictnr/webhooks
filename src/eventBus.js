const ipc = require('node-ipc')
const prepareParams = require('./prepareParams')

class EventBus {
  constructor (config) {
    this.config = prepareParams(config.params || {})
    this.logger = config.logger
  }

  start (unitName) {
    this.unitName = unitName

    ipc.config.retry = 5000

    ipc.config.logger = (message) => {
      var loggerChanel = this.logger.debug

      if (message.indexOf('retrying reset') !== -1) {
        loggerChanel = this.logger.info
      }

      if (message.indexOf('Connecting client via') !== -1) {
        loggerChanel = this.logger.debug
      }

      if (message.indexOf('requested connection to') !== -1) {
        loggerChanel = this.logger.warn
      }

      loggerChanel(`[Webhooks-client] unit: ${this.unitName} ${message}`)
    }

    ipc.connectToNet(
      this.unitName,
      this.config.get('masterHost'),
      this.config.get('masterPort')
    )
  }

  emit (event) {
    if (!event.hasOwnProperty('eventType')) {
      throw new Error('Pssed value is not event')
    }

    if (!ipc.of.hasOwnProperty(this.unitName)) {
      throw new Error(`Event bus not started for unit: ${this.unitName}`)
    }

    ipc.of[this.unitName].emit('webhookEvent', event)
  }

  stop () {
    ipc.disconnect(this.unitName)
  }
}

module.exports = EventBus
