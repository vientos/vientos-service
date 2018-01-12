const Boom = require('boom')
const Matching = require('./../models/matching')
const bus = require('../bus')

async function list (request, reply) {
  reply(await Matching.find({}))
}

async function save (request, reply) {
  let valid = request.payload.creator === request.auth.credentials.id &&
              request.payload.intents.length === 2
  // TODO: check if matching for those intents doesn't already exist
  // TODO: check if _id same as request.params.id
  //       and matches process.env.OAUTH_CLIENT_DOMAIN + '/matchings/'
  if (!valid) return reply(Boom.badData())
  let matching = new Matching(request.payload)
  let authorized = await matching.authorized(request.auth.credentials.id)
  if (!authorized) return reply(Boom.forbidden())
  await matching.save()
  reply(matching)
  bus.emit('update', matching._doc)
}

module.exports = {
  list,
  save
}
