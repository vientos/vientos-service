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

module.exports = Intent
