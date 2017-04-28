const Mongoose = require('mongoose')

const placeSchema = new Mongoose.Schema({
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number }
})

const projectSchema = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String },
  name: { type: String },
  description: { type: String },
  logo: { type: String },
  // TODO turn into subdocuments like followings
  admins: [{ type: String, ref: 'Person' }],
  links: [{ type: String }],
  contacts: [{ type: String }],
  categories: [{ type: String }],
  locations: [placeSchema]
})

const Project = Mongoose.model('Project', projectSchema, 'projects')

module.exports = Project
