const Mongoose = require('mongoose')
const Person = require('./person')
const schema = require('./schemas').intent

const Intent = Mongoose.model('Intent', schema, 'intents')

module.exports = Intent
