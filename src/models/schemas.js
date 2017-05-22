const Mongoose = require('mongoose')

const place = new Mongoose.Schema({
  type: { type: String, default: 'Place' },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number }
})

const project = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Project' },
  name: { type: String },
  description: { type: String },
  logo: { type: String },
  links: [{ type: String }],
  contacts: [{ type: String }],
  categories: [{ type: String }],
  locations: [place],
  // TODO turn into subdocuments like followings
  admins: [{ type: String, ref: 'Person' }]
})

const intent = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Intent' },
  title: { type: String },
  description: { type: String },
  question: { type: String },
  logo: { type: String },
  status: { type: String, default: 'active' },
  direction: { type: String }, // offer || request
  collaborationType: { type: String },
  condition: { type: String },
  expiryDate: { type: String },
  creator: { type: String, ref: 'Person' },
  locations: [place],
  projects: [{ type: String, ref: 'Project' }],
  // TODO turn into subdocuments like followings
  admins: [{ type: String, ref: 'Person' }],
  openConversations: [{ type: String, ref: 'Conversation' }],
  abortedConversations: [{ type: String, ref: 'Conversation' }],
  collaborations: [{ type: String, ref: 'Collaboration' }]
})

const credential = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String },
  // TODO: rename to providerId
  id: { type: String },
  email: { type: String },
  provider: { type: String }
})

const following = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Following' },
  person: { type: String, ref: 'Person' },
  project: { type: String, ref: 'Project' }
})

const favoring = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Favoring' },
  person: { type: String, ref: 'Person' },
  intent: { type: String, ref: 'Intent' }
})

const subscription = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Subscription' },
  person: { type: String, ref: 'Person' },
  endpoint: { type: String },
  keys: { type: Object }
})

const person = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Person' },
  name: { type: String },
  logo: { type: String },
  categories: [{ type: String }],
  credentials: [credential],
  followings: [following],
  favorings: [favoring],
  subscriptions: [subscription]
})

const message = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Message' },
  body: { type: String },
  createdAt: { type: Date, default: Date.now },
  creator: { type: String, ref: 'Person' },
  conversation: { type: String, ref: 'Conversation' }
})

const review = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Review' },
  as: { type: String },
  body: { type: String },
  createdAt: { type: Date, default: Date.now },
  creator: { type: String, ref: 'Person' },
  conversation: { type: String, ref: 'Conversation' },
  collaboration: { type: String, ref: 'Collaboration' }
})

const collaboration = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Collaboration' },
  body: { type: String },
  conversation: { type: String, ref: 'Conversation' }
})

const conversation = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Conversation' },
  creator: { type: String, ref: 'Person' },
  causingIntent: { type: String, ref: 'Intent' },
  matchingIntent: { type: String, ref: 'Intent' },
  collaboration: collaboration,
  messages: [message],
  reviews: [review]
})

module.exports = {
  project,
  place,
  intent,
  person,
  conversation
}
