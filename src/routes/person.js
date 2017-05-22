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
    method: 'GET',
    path: '/people',
    config: {
      handler: PersonController.list,
      auth: false
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
  },
  {
    method: 'PUT',
    path: '/favorings/{id}',
    config: {
      handler: PersonController.favor
    }
  },
  {
    method: 'DELETE',
    path: '/favorings/{id}',
    config: {
      handler: PersonController.unfavor
    }
  },
  {
    method: 'PUT',
    path: '/subscriptions/{id}',
    config: {
      handler: PersonController.subscribe
    }
  }
]
