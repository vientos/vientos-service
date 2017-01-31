const Boom = require('boom')
const Person = require('./../models/person')

const PWA_URL = process.env.PWA_URL || 'http://localhost:8080'

function hello (request, reply) {
  Person.findById(request.auth.credentials.id)
    .then(person => {
      if (!person) throw new Error('no person found based on cookie!')
      reply(person.getProfile())
    })
}

function bye (request, reply) {
  request.cookieAuth.clear()
  reply().code(204)
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
      return new Person({ credentials: [credential] }).save()
    }
  }).then(person => {
    request.cookieAuth.set({ id: person._id })
    reply().redirect(PWA_URL)
  })
}

module.exports = {
  hello,
  bye,
  oauth
}
