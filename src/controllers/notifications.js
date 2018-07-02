const Boom = require('boom')
const Notification = require('./../models/notification')

const ns = process.env.OAUTH_CLIENT_DOMAIN + '/notifications/'
const peopleNs = process.env.OAUTH_CLIENT_DOMAIN + '/people/'

/**
 * the service creates notifications so client only can save
 * notification which already exists
 */
async function save (request, reply) {
  let notification = await Notification.findById(ns + request.params.id)
  if (!notification) return reply(Boom.badRequest())
  let authorized = request.auth.credentials.id === notification.for
  if (!authorized) return reply(Boom.forbidden())
  let updated = await Notification.findByIdAndUpdate(
    ns + request.params.id,
    request.payload,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  return reply(updated)
}

/**
 * only notifications on conversations i can engage with
 * it will filter out notifications on conversations on intents
 * which i don't admin any more
 */
async function mine (request, reply) {
  let authorized = peopleNs + request.params.id === request.auth.credentials.id
  if (!authorized) return reply(Boom.forbidden())
  let notifications = await Notification.findActiveForPerson(request.auth.credentials.id)
  reply(notifications)
}

module.exports = {
  save,
  mine
}
