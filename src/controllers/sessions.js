const Boom = require('boom')

function inPersonalScope (request, reply) {
  if (request.params.id !== request.auth.credentials.sessionId) {
    reply(Boom.forbidden())
    return false
  }
  return true
}

function get (request, reply) {
  if (inPersonalScope(request, reply)) {
    reply({
      _id: request.auth.credentials.sessionId,
      person: request.auth.credentials.id
    })
  }
}

function remove (request, reply) {
  if (inPersonalScope(request, reply)) {
    request.cookieAuth.clear()
    reply().code(204)
  }
}

module.exports = {
  get,
  remove
}
