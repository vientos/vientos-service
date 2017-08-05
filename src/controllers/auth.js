const crypto = require('crypto')
const cuid = require('cuid')
const Boom = require('boom')
const Person = require('./../models/person')

const PWA_URL = process.env.PWA_URL || 'http://localhost:8080'

async function oauth (request, reply) {
  if (!request.auth.isAuthenticated) return reply(Boom.unauthorized())
  let credential = {
    id: request.auth.credentials.profile.id,
    email: request.auth.credentials.profile.email,
    provider: request.path.split('/')[2] // 'google', 'facebook' etc.
  }
  let person = await Person.findOne({
    credentials: { $elemMatch: { email: credential.email } }
  })
  if (person) {
    if (!person.hasCredentialWithId(credential.id)) {
      await person.addCredential(credential)
    }
  } else {
    let emailHash = crypto.createHash('md5').update(credential.email).digest('hex')
    person = await new Person({
      _id: process.env.OAUTH_CLIENT_DOMAIN + '/people/' + cuid(),
      name: request.auth.credentials.profile.displayName,
      logo: `https://robohash.org/${emailHash}?set=set4`,
      credentials: [credential]
    }).save()
  }
  request.cookieAuth.set({
    id: person._id,
    sessionId: cuid() })
  reply().redirect(PWA_URL)
}

module.exports = {
  oauth
}
