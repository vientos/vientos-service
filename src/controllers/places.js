const Place = require('./../models/place')

async function list (request, reply) {
  reply(await Place.find({}))
}

async function save (request, reply) {
  reply(await Place.create(request.payload))
}

module.exports = {
  list,
  save
}
