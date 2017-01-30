var Mongoose   = require('mongoose');
var Schema     = Mongoose.Schema;
var ObjectId   = Mongoose.Schema.Types.ObjectId

// The data schema for an event that we're tracking in our analytics engine
var projectSchema = new Schema({
  name:         { type: String }
});

var Project = Mongoose.model('Project', projectSchema, 'projects').;

module.exports = Project
