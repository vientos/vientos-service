var Mongoose = require('mongoose')
var Schema = Mongoose.Schema
var ObjectId = Mongoose.Schema.Types.ObjectId

// The data schema for an event that we're tracking in our analytics engine
var personSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  follows: [{ type: ObjectId, ref: 'Project' }]
})

// TODO change collection name to 'people'
var Person = Mongoose.model('Person', personSchema, 'users')

module.exports = Person
