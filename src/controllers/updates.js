const Boom = require('boom')
const subscribe = require('../channels')

const peopleNs = process.env.SERVICE_URL + '/people/'

function publicChannel (request, reply) {
  subscribe(request.raw.req, request.raw.res)
  return reply.close({ end: false })
}

function privateChannel (request, reply) {
  let authorized = peopleNs + request.params.id === request.auth.credentials.id
  if (!authorized) return reply(Boom.forbidden())
  subscribe(request.raw.req, request.raw.res, request.auth.credentials.id)
  return reply.close({ end: false })
}

module.exports = {
  publicChannel,
  privateChannel
}
