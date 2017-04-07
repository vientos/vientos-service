const Boom = require('boom')
const Project = require('./../models/project')
const ns = process.env.OAUTH_CLIENT_DOMAIN + '/projects/'

function canCreateOrUpdate (project, personId) {
  return project.admins.includes(personId)
}

function list (request, reply) {
  Project.find({})
    .then(projects => reply(projects))
}

function view (request, reply) {
  Project.findById(ns + request.params.projectId)
    .then(project => reply(project))
}

// TODO refactor make dry with intents save
// TODO moderation flow for new projects
function save (request, reply) {
  Project.findById(ns + request.params.projectId)
    .then(project => {
      if (project) {
        // otherwise one could edit anyone elses existing projects
        // by adding/replacing project in projects array
        return canCreateOrUpdate(project, request.auth.credentials.id)
      } else {
        return canCreateOrUpdate(request.payload, request.auth.credentials.id)
      }
    }).then(allowed => {
      if (!allowed) {
        reply(Boom.forbidden())
        return null
      } else {
        return Project.findByIdAndUpdate(
          ns + request.params.projectId,
          request.payload,
          { new: true, upsert: true }
        )
      }
    }).then(project => {
      if (project) {
        return reply(project)
      }
    }).catch(err => { throw err })
}

module.exports = {
  list,
  view,
  save
}
