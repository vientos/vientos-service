const Person = require('./../models/person')

function inPersonalScope (request, reply) {
  if (request.params.personId !== request.auth.credentials.id) {
    reply().code(403)
    return false
  }
  return true
}

function follow (request, reply) {
  if (inPersonalScope(request, reply)) {
    Person.findByIdAndUpdate(
      request.auth.credentials.id,
      { $addToSet: { follows: request.params.projectId } }
    ).then(result => reply().code(204))
    .catch(err => { throw err })
  }
}

function unfollow (request, reply) {
  if (inPersonalScope(request, reply)) {
    Person.findByIdAndUpdate(
      request.auth.credentials.id,
      { $pull: { follows: request.params.projectId } }
    ).then(result => reply().code(204))
    .catch(err => { throw err })
  }
}

module.exports = {
  follow,
  unfollow
}
