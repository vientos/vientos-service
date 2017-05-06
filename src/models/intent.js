const Mongoose = require('mongoose')

// refator in new model - Also used in project model
const placeSchema = new Mongoose.Schema({
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number }
})

const intentSchema = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String },
  projects: [{ type: String, ref: 'Project' }],
  title: { type: String },
  description: { type: String },
  logo: { type: String },
  admins: [{ type: String }],
  creator: { type: String },
  status: { type: String, default: 'active' },
  direction: { type: String }, // offer || request
  collaborationType: { type: String },
  condition: { type: String },
  expiryDate: { type: String },
  locations: [placeSchema],
  openConversations: [{ type: String }]
})

const Intent = Mongoose.model('Intent', intentSchema, 'intents')

Intent.prototype.addOpenConversation = function addOpenConversation (conversation) {
  if (!this.openConversations) this.openConversations = []
  this.openConversations.push(conversation._id)
  return this.save()
}

module.exports = Intent
