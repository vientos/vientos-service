const crypto = require('crypto')
const cuid = require('cuid')
const Boom = require('boom')
const Person = require('./../models/person')

const PWA_URL = process.env.PWA_URL || 'http://localhost:8080'

function oauth (request, reply) {
  if (!request.auth.isAuthenticated) {
    reply(Boom.unauthorized())
  }
  let name = request.auth.credentials.profile.displayName
  let credential = {
    id: request.auth.credentials.profile.id,
    email: request.auth.credentials.profile.email,
    provider: request.path.split('/')[2] // 'google', 'facebook' etc.
  }
  Person.findOne({
    credentials: { $elemMatch: { email: credential.email } }
  }).then(person => {
    if (person) {
      if (person.hasCredentialWithId(credential.id)) {
        return person
      } else {
        return person.addCredential(credential)
      }
    } else {
      let emailHash = crypto.createHash('md5').update(credential.email).digest('hex')
      return new Person({
        _id: process.env.OAUTH_CLIENT_DOMAIN + '/people/' + cuid(),
        name,
        logo: `https://robohash.org/${emailHash}?set=set4`,
        credentials: [credential]
      }).save()
    }
  }).then(person => {
    request.cookieAuth.set({
      id: person._id,
      sessionId: cuid() })
    // TODO: decuple from app
    reply().redirect(PWA_URL + '/me')
  })
}

module.exports = {
  oauth
}
