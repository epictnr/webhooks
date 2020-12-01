const Webhooks = require('./webhooks')
const ipc = require('node-ipc')
const prepareParams = require('./prepareParams')

class WebhooksMaster {
  constructor (config) {
    this.config = prepareParams(config.params || {})
    this.logger = config.logger

    this.clients = []
  }

  setClients (clients) {
    this.clients = clients
  }

  start () {
    ipc.config.retry = 1500

    ipc.config.logger = (message) => {
      var loggerChanel = this.logger.info

      if (message.indexOf('received event of') !== -1) {
        loggerChanel = this.logger.debug
      }

      loggerChanel(`[Webhooks] ${message}`)
    }

    ipc.serveNet(
      this.config.get('masterHost'),
      this.config.get('masterPort')
    )

    this.webhooks = new Webhooks(this.clients, this.config, this.logger)

    ipc.server.start()

    ipc.server.on('webhookEvent', (event) => {
      if (!this.config.get('enable')) {
        return
      }

      this.webhooks.pushEvent(event)
    })

    ipc.server.on('error', (err) => {
      this.logger.error(`[Webhooks] ${err}`)
    })
  }

  stop () {
    ipc.server.stop()
  }
}

module.exports = WebhooksMaster
