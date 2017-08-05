const Mongoose = require('mongoose')
const schema = require('./schemas').notification
const Conversation = require('./../models/conversation')

const Notification = Mongoose.model('Notification', schema, 'notifications')

module.exports = Notification

Notification.findActiveForPerson = function findActiveForPerson (personId) {
  return Conversation.findByPersonCanEngage(personId)
    .then(conversations => {
      return Notification.find({
        for: personId,
        active: true,
        object: { $in: conversations.map(c => c._id) }
      })
    })
}
