const Mongoose = require('mongoose')

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
  categories: [{ type: String }]
})

const Project = Mongoose.model('Project', projectSchema, 'projects')

module.exports = Project
