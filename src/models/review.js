const Mongoose = require('mongoose')
const schema = require('./schemas').review

const Review = Mongoose.model('Review', schema, 'reviews')

module.exports = Review
