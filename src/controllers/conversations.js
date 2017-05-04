const Boom = require('boom')
const Conversation = require('./../models/conversation')
const Intent = require('./../models/intent')
const Project = require('./../models/project')

const ns = process.env.OAUTH_CLIENT_DOMAIN + '/conversations/'
const peopleNs = process.env.OAUTH_CLIENT_DOMAIN + '/people/'

function canEngage (conversation, personId) {
  // im creator
  if (conversation.creator === personId) return true
  let intentIds = [conversation.causingIntent]
  // I admin causing or matching intent
  if (conversation.matchingIntent) intentIds.push(conversation.matchingIntent)
  return Intent.find({id: {$in: intentIds}})
    .then(intents => {
      if (intents.some(intent => intent.admins.includes(personId))) return true
      else {
        // I admin a project associeated with causing or matching intent
        let projectIds = intents.reduce((acc, intent) => {
          return acc.concat(intent.projects)
        }, [])
        Project.find({id: {$in: projectIds}})
          .then(projects => {
            return projects.some(project => project.admins.includes(personId))
          }
        )
      }
    })
}

function view (request, reply) {
  Conversation.findById(ns + request.params.id)
    .then(conversation => {
      if (!conversation) return reply(Boom.notFound())
      canEngage(conversation, request.auth.credentials.id)
        .then(allowed => {
          if (allowed) reply(conversation)
          else reply(Boom.forbidden())
        }
      )
    })
    .catch(err => { throw err })
}

// TODO optimize when loooots of conversations
function mine (request, reply) {
  if (peopleNs + request.params.id !== request.auth.credentials.id) return reply(Boom.forbidden())
  let all
  Conversation.find({})
    .then(conversations => {
      all = conversations
      return Promise.all(conversations.map(conversation => canEngage(conversation, request.auth.credentials.id)))
    }).then(canMap => {
      reply(all.filter((conversation, index) => canMap[index]))
    })
    .catch(err => { throw err })
}

// TODO if open conversation with same creator, cousing and matching intent, dont
// TODO check if causing and matching exist and are active, in the db
function create (request, reply) {
  if (request.payload.creator !== request.auth.credentials.id || !request.payload.causingIntent) return reply(Boom.badData())
  request.payload.messages[0].conversation = request.payload._id
  Conversation.create(request.payload)
    .then(conversation => reply(conversation))
    .catch(err => { throw err })
}

function addMessage (request, reply) {
  Conversation.findById(ns + request.payload.conversation)
    .then(conversation => {
      if (!conversation) return reply(Boom.badData())
      canEngage(conversation, request.auth.credentials.id)
        .then(allowed => {
          if (!allowed) return reply(Boom.forbidden())
          conversation.messages.push(request.payload)
          conversation.save()
            .then(updated => reply(updated.messages.find(message => message._id === request.payload._id)))
        }
      )
    })
    .catch(err => { throw err })
}

module.exports = {
  view,
  mine,
  create,
  addMessage
}
