const cuid = require('cuid')
const Boom = require('boom')
const Person = require('./../models/person')

const PWA_URL = process.env.PWA_URL || 'http://localhost:8080'

function hello (request, reply) {
  reply().redirect('/sessions/' + request.auth.credentials.sessionId).code(303)
}

function oauth (request, reply) {
  if (!request.auth.isAuthenticated) {
    reply(Boom.unauthorized())
  }
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
      return new Person({
        _id: process.env.OAUTH_CLIENT_DOMAIN + '/people/' + cuid(),
        credentials: [credential]
      }).save()
    }
  }).then(person => {
    request.cookieAuth.set({
      id: process.env.OAUTH_CLIENT_DOMAIN + '/' + person._id,
      sessionId: cuid() })
    reply().redirect(PWA_URL)
  })
}

module.exports = {
  hello,
  oauth
}
