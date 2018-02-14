const Boom = require('boom')

const ns = process.env.OAUTH_CLIENT_DOMAIN + '/sessions/'

// TODO session model (non mongoose)
function get (request, reply) {
  let authorized = request.params.id === request.auth.credentials.sessionId
  if (!authorized) return reply(Boom.forbidden())
  reply({
    _id: ns + request.auth.credentials.sessionId,
    type: 'Session',
    person: request.auth.credentials.id
  })
}

function remove (request, reply) {
  let authorized = request.params.id === request.auth.credentials.sessionId
  if (!authorized) return reply(Boom.forbidden())
  request.cookieAuth.clear()
  reply().code(204)
}

module.exports = {
  get,
  remove
}
