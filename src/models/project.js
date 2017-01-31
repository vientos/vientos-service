const Mongoose = require('mongoose')

const projectSchema = new Mongoose.Schema({
  name: { type: String }
})

const Project = Mongoose.model('Project', projectSchema, 'projects')

module.exports = Project
