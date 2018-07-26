const Boom = require('boom')
const Project = require('./../models/project')
const Intent = require('./../models/intent')
const bus = require('../bus')

const ns = process.env.SERVICE_URL + '/intents/'

async function canCreateOrUpdate (intent, personId) {
  let projects = await Project.find({ _id: { $in: intent.projects }, admins: personId })
  return projects.length > 0
}

async function list (request, reply) {
  reply(await Intent.find({}).sort({ createdAt: -1 }))
}

// we have to check first if intent already exists in database
// otherwise one could edit anyone elses existing intents
// by adding/replacing project in projects array
async function save (request, reply) {
  let intent = await Intent.findById(ns + request.params.intentId)
  if (!intent) intent = request.payload
  let authorized = await canCreateOrUpdate(intent, request.auth.credentials.id)
  if (!authorized) return reply(Boom.forbidden())
  let updated = await Intent.findByIdAndUpdate(
    ns + request.params.intentId,
    request.payload,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  reply(updated)
  bus.emit('update', updated._doc)
}

module.exports = {
  list,
  save
}
