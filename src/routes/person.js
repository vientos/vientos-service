const PersonController = require('./../controllers/person')

module.exports = [
  {
    method: 'GET',
    path: '/people/{id}',
    config: {
      handler: PersonController.get
    }
  },
  {
    method: 'PUT',
    path: '/people/{id}',
    config: {
      handler: PersonController.save
    }
  },
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
