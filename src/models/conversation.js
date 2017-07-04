const Mongoose = require('mongoose')
const schema = require('./schemas').conversation
const Project = require('./project')
const Person = require('./person')
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

Conversation.prototype.notifyCreator = function notifyCreator (message) {
  Person.findById(this.creator)
    .then(person => {
      person.notify(this, message)
    })
}

Conversation.prototype.addMessage = function addMessage (payload) {
  this.messages.push(payload)
  let message
  return this.save()
    .then(conversation => {
      message = this.messages.find(message => message._id === payload._id)
      if (message.creator !== conversation.creator) conversation.notifyCreator(message)
      return conversation.loadRelatedIntents()
    }).then(intents => {
      intents.forEach(intent => intent.notifyAdmins(this, message))
    }).then(() => message)
}

// TODO Copy/Reuse from pwa canReview()
Conversation.prototype.addReview = function addReview (payload) {
  // TODO: also check if admin of the matchingIntent // there can be only two reviews
  this.reviews.push(payload)
  let review
  let updatedConversation
  return this.save()
    .then(conversation => {
      updatedConversation = conversation
      review = updatedConversation.reviews.find(review => review.creator === payload.creator)
      if (review.creator !== conversation.creator) conversation.notifyCreator(review)
      if (updatedConversation.reviews.length === 1) {
        return this.loadRelatedIntents()
      } else {
        return []
      }
    }).then(intents => {
      return Promise.all(intents.map(intent => intent.handleConversationEnding(updatedConversation, review)))
    }).then(() => {
      return review
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
  // no matching intent and i'm creator
  if (!this.matchingIntent && this.creator === personId) return Promise.resolve(true)
  // I admin causing or matching intent
  return this.loadRelatedIntents()
    .then(intents => {
      if (intents.some(intent => intent.admins.includes(personId))) return true
      else return false
    })
}

module.exports = Conversation
