epictnr webhooks
======

Отправка событий через webhook`и

### Для публикации пакета:

```bash
npm pub
```


### Example:

#### Configs:
```js
const config = {
    webHooks: {
        enable: true,
        masterHost: 'webhooks',
        masterPort: 8000,
        initiatorServiceId: 'myService',
        sendEventsInterval: '5 second'
    }
}
```

#### init:
```js
const epictnrWebhooks = require('@epictnr/webhooks')
const logger = require('../logger')
const config = require('../config')

const clients = [
    {
        'id': 1,
        'service': 'big-service',
        'events': [
            'some_balacne_change',
            'another_event_change',
        ],
        'endpoint': 'test.acme.dev/events'
    }
]

const webhooksConfig = {
  params: config.webHooks,
  logger: logger
}

const eventBus = epictnrWebhooks.eventBus(webhooksConfig)

const webhooksMaster = epictnrWebhooks.webhooksMaster(webhooksConfig)
webhooksMaster.setClients(clients)
```

#### Master Server:
```js
webhooksMaster.start()

process.on('SIGINT', () => {
    webhooksMaster.stop()
})
```

#### Send event:
```js
class AcmeBalanceChange {
  constructor (accountId, balance, previousBalance, currency) {
    this.eventType = this.getEventType()

    this.accountId = accountId
    this.balance = balance
    this.previousBalance = previousBalance
    this.currency = currency
  }

  getEventType () {
    return 'some_balacne_change'
  }
}

eventBus.emit(new AcmeBalanceChange(
    'accountId',
    100,
    50,
    'RUB'
))
```
