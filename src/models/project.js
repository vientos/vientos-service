const Mongoose = require('mongoose')
const schema = require('./schemas').project

const Project = Mongoose.model('Project', schema, 'projects')

module.exports = Project
