const Boom = require('boom')
const Project = require('./../models/project')
const ns = process.env.OAUTH_CLIENT_DOMAIN + '/projects/'

function canCreateOrUpdate (project, personId) {
  return project.admins.includes(personId)
}

async function list (request, reply) {
  reply(await Project.find({}).sort({ createdAt: -1 }))
}

// we have to check first if project already exists in database
// otherwise one could edit anyone elses existing projects
// by adding/replacing project in projects array
// TODO moderation flow for new projects
async function save (request, reply) {
  let project = await Project.findById(ns + request.params.projectId)
  if (!project) project = request.payload
  let authorized = canCreateOrUpdate(project, request.auth.credentials.id)
  if (!authorized) return reply(Boom.forbidden())
  let updated = await Project.findByIdAndUpdate(
    ns + request.params.projectId,
    request.payload,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  reply(updated)
}

module.exports = {
  list,
  save
}
