const Place = require('./../models/place')
const bus = require('../bus')
const Mongoose = require('mongoose')

async function list (request, reply) {
  reply(await Place.find({}))
}

async function save (request, reply) {
  const place = await Place.create(request.payload)
  reply(place)
  bus.emit('update', place._doc)
}

async function states (request, reply) {
  reply(await Mongoose.connection.db.collection('states').find({}).toArray())
}
async function municipalities (request, reply) {
  reply(await Mongoose.connection.db.collection('municipalities').find({
    state: `${process.env.SERVICE_URL}/places/${request.params.stateId}`
  }).toArray())
}

module.exports = {
  list,
  save,
  states,
  municipalities
}
