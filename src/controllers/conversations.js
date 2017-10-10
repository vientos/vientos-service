const Boom = require('boom')
const Conversation = require('./../models/conversation')
const bus = require('../bus')

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

// TODO if open conversation with same creator, cousing and matching intent, dont
// TODO check if causing and matching exist and are active, in the db
async function create (request, reply) {
  let valid = request.payload.creator === request.auth.credentials.id && request.payload.causingIntent
  if (!valid) return reply(Boom.badData())
  let conversation = await Conversation.create(request.payload)
  reply(conversation)
  bus.emit('update', conversation)
}

async function addMessage (request, reply) {
  let valid = request.payload.creator === request.auth.credentials.id
  if (!valid) return reply(Boom.badData())
  let conversation = await Conversation.findById(request.payload.conversation)
  if (!conversation) return reply(Boom.badData())
  let authorized = await conversation.canEngage(request.auth.credentials.id)
  if (!authorized) return reply(Boom.forbidden())
  let message = await conversation.addMessage(request.payload)
  reply(message)
  bus.emit('update', message._doc)
}

module.exports = {
  view,
  mine,
  create,
  addMessage
}
