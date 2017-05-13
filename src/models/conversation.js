const Mongoose = require('mongoose')
const schema = require('./schemas').conversation
const Project = require('./project')
const Intent = require('./intent')

const Conversation = Mongoose.model('Conversation', schema, 'conversations')

Conversation.findByPersonCanEngage = function findByPersonCanEngage (personId) {
  let all
  return Conversation.find({})
    .then(conversations => {
      all = conversations
      return Promise.all(conversations.map(conversation => conversation.canEngage(personId)))
    }).then(canMap => {
      return all.filter((conversation, index) => canMap[index])
    })
}

Conversation.createAndAddBacklinks = function createAndAddBacklinks (payload) {
  // fist message doesn't reference the conversation so we add that reference
  payload.messages[0].conversation = payload._id
  let newConversation
  return Conversation.create(payload)
    .then(conversation => {
      newConversation = conversation
      return conversation.loadRelatedIntents()
    }).then(intents => {
      return Promise.all(intents.map(intent => intent.addOpenConversation(newConversation)))
    }).then(() => newConversation)
}

Conversation.prototype.addMessage = function addMessage (payload) {
  this.messages.push(payload)
  return this.save()
    .then(conversation => {
      return conversation.messages.find(message => message._id === payload._id)
    })
}

// TODO Copy/Reuse from pwa canReview()
Conversation.prototype.addReview = function addReview (payload) {
  // TODO: also check if admin of the matchingIntent // there can be only two reviews
  this.reviews.push(payload)
  let updatedConversation
  return this.save()
    .then(conversation => {
      updatedConversation = conversation
      if (updatedConversation.reviews.length === 1) {
        return this.loadRelatedIntents()
      } else {
        return []
      }
    }).then(intents => {
      return Promise.all(intents.map(intent => intent.handleConversationEnding(updatedConversation)))
    }).then(() => {
      return updatedConversation.reviews.find(review => review.creator === payload.creator)
    })
}

Conversation.prototype.saveCollaboration = function saveCollaboration (payload) {
  this.collaboration = payload
  return this.save()
    .then(conversation => {
      return conversation.collaboration
    })
}

Conversation.prototype.removeCollaboration = function removeCollaboration (payload) {
  this.collaboration.remove()
  return this.save()
}

Conversation.prototype.loadRelatedIntents = function loadRelatedIntents () {
  let intentIds = [this.causingIntent]
  if (this.matchingIntent) intentIds.push(this.matchingIntent)
  return Intent.find({_id: {$in: intentIds}})
}

Conversation.prototype.canEngage = function canEngage (personId) {
  // im creator
  if (this.creator === personId) return Promise.resolve(true)
  // I admin causing or matching intent
  return this.loadRelatedIntents()
    .then(intents => {
      if (intents.some(intent => intent.admins.includes(personId))) return true
      else {
        // I admin a project associeated with causing or matching intent
        let projectIds = intents.reduce((acc, intent) => {
          return acc.concat(intent.projects)
        }, [])
        return Project.find({_id: {$in: projectIds}})
          .then(projects => {
            return projects.some(project => project.admins.includes(personId))
          }
        )
      }
    })
}

module.exports = Conversation
