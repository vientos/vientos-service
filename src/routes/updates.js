const UpdatesController = require('../controllers/updates')

module.exports = [
  {
    method: 'GET',
    path: '/updates',
    config: {
      handler: UpdatesController.publicChannel,
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/people/{id}/updates',
    config: {
      handler: UpdatesController.privateChannel
    }
  }
]
