const Mongoose = require('mongoose')
const schema = require('./schemas').intent

const Intent = Mongoose.model('Intent', schema, 'intents')

Intent.prototype.addOpenConversation = function addOpenConversation (conversation) {
  if (!this.openConversations) this.openConversations = []
  this.openConversations.push(conversation._id)
  return this.save()
}

Intent.prototype.handleConversationEnding = function handleConversationEnding (conversation) {
  if (conversation.collaboration) {
    if (!this.collaborations) this.collaborations = []
    this.collaborations.push(conversation.collaboration._id)
  } else {
    if (!this.abortedConversations) this.abortedConversations = []
    this.abortedConversations.push(conversation._id)
  }
  this.openConversations = this.openConversations.filter(conversationId => conversationId !== conversation._id)
  return this.save()
}

module.exports = Intent
