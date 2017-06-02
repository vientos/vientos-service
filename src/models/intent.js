const Mongoose = require('mongoose')
const Person = require('./person')
const schema = require('./schemas').intent

const Intent = Mongoose.model('Intent', schema, 'intents')

Intent.prototype.notifyAdmins = function notifyAdmins (conversation, message) {
  return Person.find({_id: {$in: this.admins}})
   .then(admins => {
     admins.forEach(admin => {
       if (admin._id === conversation.creator || (message && admin._id === message.creator)) return
       admin.notify(conversation, message)
     })
   })
}

Intent.prototype.addOpenConversation = function addOpenConversation (conversation) {
  if (!this.openConversations) this.openConversations = []
  this.openConversations.push(conversation._id)
  this.notifyAdmins(conversation)
  return this.save()
}

Intent.prototype.handleConversationEnding = function handleConversationEnding (conversation) {
  // FIXME: currently will send 'New conversation'
  this.notifyAdmins(conversation)
  let success = conversation.reviews.some(review => review.success)
  // if (conversation.collaboration) {
  if (success) {
    // if (!this.collaborations) this.collaborations = []
    // this.collaborations.push(conversation.collaboration._id)
    if (!this.successfulConversations) this.successfulConversations = []
    this.successfulConversations.push(conversation._id)
  } else {
    if (!this.abortedConversations) this.abortedConversations = []
    this.abortedConversations.push(conversation._id)
  }
  this.openConversations = this.openConversations.filter(conversationId => conversationId !== conversation._id)
  return this.save()
}

module.exports = Intent
