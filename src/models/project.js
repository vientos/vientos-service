const Mongoose = require('mongoose')

const projectSchema = new Mongoose.Schema({
  _id: { type: String },
  name: { type: String },
  // TODO turn into subdocuments like followings
  admins: [{ type: String, ref: 'Person' }]
})

const Project = Mongoose.model('Project', projectSchema, 'projects')

module.exports = Project
