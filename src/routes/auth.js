const Boom = require('boom')

function handler (request, reply) {
  if (!request.auth.isAuthenticated) {
    reply(Boom.unauthorized())
  }

  reply(request.auth.credentials.profile)
}

module.exports.google = {
  method: 'GET',
  path: '/auth/google',
  config: {
    auth: 'google',
    handler
  }
}

module.exports.facebook = {
  method: 'GET',
  path: '/auth/facebook',
  config: {
    auth: 'facebook',
    handler
  }
}
