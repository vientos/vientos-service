const Mongoose = require('mongoose')
const schema = require('./schemas').notification

const Notification = Mongoose.model('Notification', schema, 'notifications')

module.exports = Notification
