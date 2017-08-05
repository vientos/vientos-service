const IntentsController = require('./../controllers/intents')

module.exports = [
  {
    method: 'GET',
    path: '/intents',
    config: {
      handler: IntentsController.list,
      auth: false
    }
  },
  {
    method: 'PUT',
    path: '/intents/{intentId}',
    config: {
      handler: IntentsController.save
    }
  }
]
