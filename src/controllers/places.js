const Place = require('./../models/place')
const bus = require('../bus')

async function list (request, reply) {
  reply(await Place.find({}))
}

async function save (request, reply) {
  const place = await Place.create(request.payload)
  reply(place)
  bus.emit('update', place._doc)
}

module.exports = {
  list,
  save
}
