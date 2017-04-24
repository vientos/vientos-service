const Boom = require('boom')
const Person = require('./../models/person')
const ns = process.env.OAUTH_CLIENT_DOMAIN + '/people/'
const followingsNs = process.env.OAUTH_CLIENT_DOMAIN + '/followings/'

function get (request, reply) {
  if (ns + request.params.id !== request.auth.credentials.id) {
    reply(Boom.forbidden())
  } else {
    Person.findById(request.auth.credentials.id)
      .then(person => {
        if (!person) return new Error('no person found based on cookie!')
        reply(person.getProfile())
      }).catch(err => { throw err })
  }
}

function save (request, reply) {
  Person.findById(ns + request.params.id)
    .then(person => {
      if (person) {
        return request.auth.credentials.id === person._id
      } else {
        return false
      }
    }).then(allowed => {
      if (!allowed) {
        reply(Boom.forbidden())
        return null
      } else {
        return Person.findByIdAndUpdate(
          ns + request.params.id,
          request.payload,
          { new: true, upsert: true }
        )
      }
    }).then(person => {
      if (person) {
        return reply(person.getProfile())
      }
    }).catch(err => { throw err })
}

function follow (request, reply) {
  if (request.payload.person !== request.auth.credentials.id) {
    reply(Boom.forbidden())
  } else {
    Person.findById(request.auth.credentials.id)
    .then(person => {
      // make sure not alraedy following
      if (person.followings.find(el => el.project === request.payload.project)) {
        reply(Boom.conflict())
        return null
      } else {
        person.followings.push(request.payload)
        return person.save()
      }
    }).then(person => {
      if (person) {
        reply(person.followings.id(request.payload._id))
      }
    }).catch(err => { throw err })
  }
}

function unfollow (request, reply) {
  // TODO: 403 if attempted to remove someone else's following
  Person.findById(request.auth.credentials.id)
  .then(person => {
    person.followings.id(followingsNs + request.params.id).remove()
    return person.save()
  }).then(result => reply().code(204))
  .catch(err => { throw err })
}

module.exports = {
  get,
  save,
  follow,
  unfollow
}
