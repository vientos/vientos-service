const Boom = require('boom')
const Conversation = require('./../models/conversation')

const ns = process.env.OAUTH_CLIENT_DOMAIN + '/conversations/'
const peopleNs = process.env.OAUTH_CLIENT_DOMAIN + '/people/'

async function view (request, reply) {
  let conversation = await Conversation.findById(ns + request.params.id)
  if (!conversation) return reply(Boom.notFound())
  let authorized = await conversation.canEngage(request.auth.credentials.id)
  if (!authorized) return reply(Boom.forbidden())
  reply(conversation)
}

// TODO optimize when loooots of conversations
async function mine (request, reply) {
  let authorized = peopleNs + request.params.id === request.auth.credentials.id
  if (!authorized) return reply(Boom.forbidden())
  reply(await Conversation.findByPersonCanEngage(request.auth.credentials.id))
}

async function listReviews (request, reply) {
  let conversations = await Conversation.find({})
  let reviews = conversations.reduce((acc, conversation) => {
    return acc.concat(conversation.reviews)
  }, [])
  reply(reviews)
}

// TODO if open conversation with same creator, cousing and matching intent, dont
// TODO check if causing and matching exist and are active, in the db
async function create (request, reply) {
  let valid = request.payload.creator === request.auth.credentials.id && request.payload.causingIntent
  if (!valid) return reply(Boom.badData())
  reply(await Conversation.createAndAddBacklinks(request.payload))
}

async function addMessage (request, reply) {
  let valid = request.payload.creator === request.auth.credentials.id
  if (!valid) return reply(Boom.badData())
  let conversation = await Conversation.findById(request.payload.conversation)
  if (!conversation) return reply(Boom.badData())
  let authorized = await conversation.canEngage(request.auth.credentials.id)
  if (!authorized) return reply(Boom.forbidden())
  reply(await conversation.addMessage(request.payload))
}

async function addReview (request, reply) {
  let valid = request.payload.creator === request.auth.credentials.id
  if (!valid) return reply(Boom.badData())
  let conversation = await Conversation.findById(request.payload.conversation)
  if (!conversation) return reply(Boom.badData())
  let authorized = await conversation.canEngage(request.auth.credentials.id)
  if (!authorized) return reply(Boom.forbidden())
  // TODO make sure not already reviewed
  reply(await conversation.addReview(request.payload))
}

module.exports = {
  view,
  mine,
  create,
  addMessage,
  listReviews,
  addReview
}
