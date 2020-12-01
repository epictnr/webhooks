const convict = require('convict')

const schema = {
  enable: {
    doc: 'Is send webhooks to client elable',
    format: 'Boolean',
    default: false,
  },
  sendEventsInterval: {
    doc: 'Send events interval',
    format: 'duration',
    default: '5 second',
  },
  initiatorServiceId: {
    doc: 'This identification send in request header X-Internal-Initiator-Service to clients',
    format: String,
    default: 'unknown service',
  },
  masterHost: {
    doc: 'Webhooks master service host',
    format: String,
    default: 'webhooks',
  },
  masterPort: {
    doc: 'Webhooks master service port',
    format: 'port',
    default: 8000,
  },
}

module.exports = function (config) {
  return convict(schema).load(config)
}
