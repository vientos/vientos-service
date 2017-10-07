const Boom = require('boom')
const Review = require('./../models/review')
const Conversation = require('./../models/conversation')

const ns = process.env.OAUTH_CLIENT_DOMAIN + '/reviews/'

async function list (request, reply) {
  reply(await Review.find({}))
}

async function save (request, reply) {
  let valid = request.payload.creator === request.auth.credentials.id
  if (!valid) return reply(Boom.badData())
  let conversation = await Conversation.findById(request.payload.conversation)
  if (!conversation) return reply(Boom.badData())
  valid = request.payload.causingIntent === conversation.causingIntent
  if (valid && request.payload.matchingIntent) {
    valid = request.payload.matchingIntent === conversation.matchingIntent
  }
  if (!valid) return reply(Boom.badData())
  let authorized = await conversation.canEngage(request.auth.credentials.id)
  if (!authorized) return reply(Boom.forbidden())
  // TODO make sure not already reviewed
  let updated = await Review.findByIdAndUpdate(
    ns + request.params.id,
    request.payload,
    { new: true, upsert: true }
  )
  reply(updated)
}

module.exports = {
  list,
  save
}
