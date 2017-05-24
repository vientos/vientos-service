const Place = require('./../models/place')

function list (request, reply) {
  Place.find({})
    .then(places => reply(places))
    .catch(err => { throw err })
}

function save (request, reply) {
  Place.create(request.payload)
    .then(place => reply(place))
    .catch(err => { throw err })
}

module.exports = {
  list,
  save
}
