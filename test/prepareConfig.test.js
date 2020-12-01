const prepareConfig = require('../src/prepareConfig')

describe('prepareConfig', () => {
  it('init return object instance of Metrics', () => {
    const config = prepareConfig({})

    console.log(config.get('sendEventsInterval'))
    // expect(metricsTest.constructor.name).toEqual('Metrics')
  })
})
