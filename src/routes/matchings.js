const MatchingsController = require('./../controllers/matchings')

module.exports = [
  {
    method: 'GET',
    path: '/matchings',
    config: {
      handler: MatchingsController.list
    }
  },
  {
    method: 'PUT',
    path: '/matchings/{id}',
    config: {
      handler: MatchingsController.save
    }
  }
]
