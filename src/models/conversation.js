const Mongoose = require('mongoose')

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

module.exports = Conversation
