const Mongoose = require('mongoose')

const projectSchema = new Mongoose.Schema({
  name: { type: String },
  admins: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Person' }]
})

const Project = Mongoose.model('Project', projectSchema, 'projects')

module.exports = Project
