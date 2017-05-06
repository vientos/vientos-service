const Mongoose = require('mongoose')
const Project = require('./project')
const Intent = require('./intent')

const messageSchema = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String },
  creator: { type: String },
  body: { type: String },
  createdAt: { type: Date, default: Date.now },
  conversation: { type: String }
})

const conversationSchema = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String },
  messages: [messageSchema],
  creator: { type: String },
  causingIntent: { type: String, ref: 'Intent' },
  matchingIntent: { type: String, ref: 'Intent' },
  status: { type: String }
})

const Conversation = Mongoose.model('Conversation', conversationSchema, 'conversations')

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

Conversation.prototype.loadRelatedIntents = function loadRelatedIntents () {
  let intentIds = [this.causingIntent]
  if (this.matchingIntent) intentIds.push(this.matchingIntent)
  return Intent.find({_id: {$in: intentIds}})
}

Conversation.prototype.canEngage = function canEngage (personId) {
  // im creator
  if (this.creator === personId) return true
  // I admin causing or matching intent
  this.loadRelatedIntents()
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

module.exports = Conversation
