const Boom = require('boom')

function inPersonalScope (request, reply) {
  if (request.params.id !== request.auth.credentials.sessionId) {
    reply(Boom.forbidden())
    return false
  }
  return true
}

// TODO session model (non mongoose)
function get (request, reply) {
  if (inPersonalScope(request, reply)) {
    let prefix = process.env.OAUTH_CLIENT_DOMAIN + '/sessions/'
    reply({
      _id: prefix + request.auth.credentials.sessionId,
      type: 'Session',
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
