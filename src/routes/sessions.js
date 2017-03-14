const SessionsController = require('../controllers/sessions')

module.exports = [
  {
    method: 'GET',
    path: '/sessions/{id}',
    config: {
      handler: SessionsController.get
    }
  },
  {
    method: 'DELETE',
    path: '/sessions/{id}',
    config: {
      handler: SessionsController.remove
    }
  }
]
