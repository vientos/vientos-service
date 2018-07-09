const Boom = require('boom')
const Person = require('./../models/person')
const bus = require('../bus')

const ns = process.env.SERVICE_URL + '/people/'
const relatedNs = {
  followings: process.env.SERVICE_URL + '/followings/',
  favorings: process.env.SERVICE_URL + '/favorings/'
}

async function get (request, reply) {
  let authorized = ns + request.params.id === request.auth.credentials.id
  if (!authorized) return reply(Boom.forbidden())
  reply(await Person.findById(request.auth.credentials.id))
}

// must use getPublicProfile no to leak private data
async function list (request, reply) {
  let people = await Person.find({})
  reply(people.map(person => person.getPublicProfile()))
}

async function save (request, reply) {
  let authorized = ns + request.params.id === request.auth.credentials.id
  if (!authorized) return reply(Boom.forbidden())
  let valid = request.auth.credentials.id === request.payload._id
  if (!valid) return reply(Boom.badData())
  let updated = await Person.findByIdAndUpdate(
    request.auth.credentials.id,
    request.payload,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  reply(updated)
  bus.emit('update', updated.getPublicProfile())
}

async function addQualifiedRelation (collectionName, propertyName, request, reply) {
  let valid = request.payload.person === request.auth.credentials.id
  if (!valid) return reply(Boom.badData())
  let person = await Person.findById(request.auth.credentials.id)
  // make sure not alraedy following
  let existing = person[collectionName].find(el => el[propertyName] === request.payload[propertyName])
  if (existing) return reply(Boom.conflict())
  person[collectionName].push(request.payload)
  await person.save()
  reply(person[collectionName].id(request.payload._id))
}

function follow (request, reply) {
  return addQualifiedRelation('followings', 'project', request, reply)
}

function favor (request, reply) {
  return addQualifiedRelation('favorings', 'intent', request, reply)
}

function subscribe (request, reply) {
  return addQualifiedRelation('subscriptions', 'endpoint', request, reply)
}

async function removeQualifiedRelation (collectionName, request, reply) {
  let person = await Person.findById(request.auth.credentials.id)
  let target = person[collectionName].id(relatedNs[collectionName] + request.params.id)
  // TODO: 403 if attempted to remove someone else's following, 404 if doesn't exist
  if (!target) return reply(Boom.badRequest())
  target.remove()
  await person.save()
  reply().code(204)
}

function unfollow (request, reply) {
  return removeQualifiedRelation('followings', request, reply)
}

function unfavor (request, reply) {
  return removeQualifiedRelation('favorings', request, reply)
}

module.exports = {
  get,
  list,
  save,
  follow,
  unfollow,
  favor,
  unfavor,
  subscribe
}
