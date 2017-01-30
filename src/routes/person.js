const PersonController = require('./../controllers/person.js')

module.exports = [
  {
    method: 'PUT',
    path: '/person/{personId}/follows/{projectId}',
    config: {
      handler: PersonController.follow
    }
  },
  {
    method: 'DELETE',
    path: '/person/{personId}/follows/{projectId}',
    config: {
      handler: PersonController.unfollow
    }
  }
]
