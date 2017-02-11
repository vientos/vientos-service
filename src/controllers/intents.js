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
}

function view (request, reply) {
  Intent.findById(request.params.intentId)
    .then(intent => reply(intent))
}

function create (request, reply) {
  canCreateOrUpdate(request.payload, request.auth.credentials.id)
    .then(allowed => {
      if (!allowed) {
        reply(Boom.forbidden())
        return null
      } else {
        return Intent.create(request.payload)
      }
    }).then(intent => {
      if (intent) {
        return reply().code(201).header('location', '/intents/' + intent._id)
      }
    })
}

function update (request, reply) {
  Intent.findById(request.params.intentId)
    .then(intent => canCreateOrUpdate(intent, request.auth.credentials.id))
    .then(allowed => {
      if (!allowed) {
        reply(Boom.forbidden())
        return null
      } else {
        return Intent.findByIdAndUpdate(request.params.intentId, request.payload)
      }
    }).then(intent => {
      if (intent) {
        return reply().code(204)
      }
    })
}

function remove (request, reply) {
  Intent.remove({_id:request.params.intentId})
    .then(() =>  reply().code(204))
}

module.exports = {
  list,
  view,
  create,
  update,
  remove
}
