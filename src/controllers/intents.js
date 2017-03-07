const Boom = require('boom')
const Project = require('./../models/project')
const Intent = require('./../models/intent')

function canCreateOrUpdate (intent, personId) {
  return Project.find({ _id: { $in: intent.projects }, admins: personId })
    .then(projects => projects.length > 0)
}

function list (request, reply) {
  Intent.find({})
    .then(intents => reply(intents))
    .catch(err => { throw err })
}

function view (request, reply) {
  Intent.findById(request.params.intentId)
    .then(intent => reply(intent))
    .catch(err => { throw err })
}

function save (request, reply) {
  Intent.findById(request.params.intentId)
    .then(intent => {
      if (intent) {
        // otherwise one could edit anyone elses existing intents
        // by adding/replacing project in projects array
        return canCreateOrUpdate(intent, request.auth.credentials.id)
      } else {
        return canCreateOrUpdate(request.payload, request.auth.credentials.id)
      }
    }).then(allowed => {
      if (!allowed) {
        reply(Boom.forbidden())
        return null
      } else {
        return Intent.findByIdAndUpdate(
          request.params.intentId,
          request.payload,
          { new: true, upsert: true }
        )
      }
    }).then(intent => {
      if (intent) {
        return reply(intent)
      }
    }).catch(err => { throw err })
}

function remove (request, reply) {
  Intent.remove({ _id: request.params.intentId })
    .then(() => reply().code(204))
    .catch(err => { throw err })
}

module.exports = {
  list,
  view,
  save,
  remove
}
