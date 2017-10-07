const Mongoose = require('mongoose')
const schema = require('./schemas').conversation
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

Conversation.prototype.addMessage = function addMessage (payload) {
  this.messages.push(payload)
  return this.save()
    .then(conversation => this.messages.find(message => message._id === payload._id))
}

Conversation.prototype.loadRelatedIntents = function loadRelatedIntents () {
  let intentIds = [this.causingIntent]
  if (this.matchingIntent) intentIds.push(this.matchingIntent)
  return Intent.find({_id: {$in: intentIds}})
}

Conversation.prototype.canEngage = function canEngage (personId) {
  // no matching intent and i'm creator - if matching intent exists conversation
  // creator may choose to stop admin that intent and shouldn't engage any more
  if (!this.matchingIntent && this.creator === personId) return Promise.resolve(true)
  // I admin causing or matching intent
  return this.loadRelatedIntents()
    .then(intents => {
      if (intents.some(intent => intent.admins.includes(personId))) return true
      else return false
    })
}

module.exports = Conversation
