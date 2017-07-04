const Boom = require('boom')
const Notification = require('./../models/notification')
const Conversation = require('./../models/conversation')

const ns = process.env.OAUTH_CLIENT_DOMAIN + '/notifications/'
const peopleNs = process.env.OAUTH_CLIENT_DOMAIN + '/people/'

function save (request, reply) {
  Notification.findById(ns + request.params.id)
    .then(notification => {
      if (notification) {
        return request.auth.credentials.id === notification.for
      } else {
        return false
      }
    }).then(allowed => {
      if (!allowed) {
        reply(Boom.forbidden())
        return null
      } else {
        return Notification.findByIdAndUpdate(
          ns + request.params.id,
          request.payload,
          { new: true, upsert: true }
        )
      }
    }).then(notification => {
      if (notification) {
        return reply(notification)
      }
    }).catch(err => { throw err })
}

/**
 * only notifications on conversations i can engage with
 * it will filter out notifications on conversations on intents
 * which i don't admin any more
 */
function mine (request, reply) {
  if (peopleNs + request.params.id !== request.auth.credentials.id) return reply(Boom.forbidden())
  Conversation.findByPersonCanEngage(request.auth.credentials.id)
    .then(conversations => Notification.find({
      for: request.auth.credentials.id,
      active: true,
      object: { $in: conversations.map(c => c._id) }
    }))
    .then(notifications => reply(notifications))
    .catch(err => { throw err })
}

module.exports = {
  save,
  mine
}
