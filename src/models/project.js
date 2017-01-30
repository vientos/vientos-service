var Mongoose = require('mongoose')
var Schema = Mongoose.Schema

var projectSchema = new Schema({
  name: { type: String }
})

var Project = Mongoose.model('Project', projectSchema, 'projects')

module.exports = Project
