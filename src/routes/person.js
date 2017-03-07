const PersonController = require('./../controllers/person')

module.exports = [
  {
    method: 'PUT',
    path: '/followings/{id}',
    config: {
      handler: PersonController.follow
    }
  },
  {
    method: 'DELETE',
    path: '/followings/{id}',
    config: {
      handler: PersonController.unfollow
    }
  }
]
