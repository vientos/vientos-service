const Mongoose = require('mongoose')

const place = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Place' },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  googlePlaceId: { type: String }
})

const project = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Project' },
  name: { type: String },
  description: { type: String },
  logo: { type: String },
  createdAt: { type: Date, default: Date.now },
  links: [{ type: String }],
  contacts: [{ type: String }],
  categories: [{ type: String }],
  locations: [{ type: String, ref: 'Place' }],
  admins: [{ type: String, ref: 'Person' }]
})

const intent = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Intent' },
  title: { type: String },
  description: { type: String },
  question: { type: String },
  logo: { type: String },
  status: { type: String, default: 'active' }, // active | inactive
  direction: { type: String }, // offer || request
  collaborationType: { type: String }, // work || usage || consumption || ownership
  reciprocity: { type: String }, // gift || barter, time-exchange, trade
  expiryDate: { type: String },
  createdAt: { type: Date, default: Date.now },
  creator: { type: String, ref: 'Person' },
  locations: [{ type: String, ref: 'Place' }],
  projects: [{ type: String, ref: 'Project' }],
  admins: [{ type: String, ref: 'Person' }]
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
  language: { type: String, default: process.env.VIENTOS_LANGUAGE },
  emailNotifications: { type: Boolean, default: true },
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
  ourTurn: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  creator: { type: String, ref: 'Person' },
  conversation: { type: String, ref: 'Conversation' }
})

const review = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Review' },
  as: { type: String },
  body: { type: String },
  rating: { type: String }, // satisfied | neutral | dissatisfied
  createdAt: { type: Date, default: Date.now },
  creator: { type: String, ref: 'Person' },
  conversation: { type: String, ref: 'Conversation' },
  success: { type: Boolean, default: false }
})

const conversation = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Conversation' },
  createdAt: { type: Date, default: Date.now },
  creator: { type: String, ref: 'Person' },
  causingIntent: { type: String, ref: 'Intent' },
  matchingIntent: { type: String, ref: 'Intent' },
  messages: [message],
  reviews: [review]
})

const notification = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String, default: 'Notification' },
  for: { type: String, ref: 'Person' },
  object: { type: String, ref: 'Conversation' },
  cause: { type: String, ref: 'Message' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = {
  place,
  project,
  intent,
  credential,
  following,
  favoring,
  subscription,
  person,
  message,
  review,
  conversation,
  notification
}
