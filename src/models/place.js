const Mongoose = require('mongoose')
const schema = require('./schemas').place

const Place = Mongoose.model('Place', schema, 'places')

module.exports = Place
