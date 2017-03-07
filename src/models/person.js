const Mongoose = require('mongoose')

const credentialSchema = new Mongoose.Schema({
  _id: { type: String },
  // TODO: rename to providerId
  id: { type: String },
  email: { type: String },
  provider: { type: String }
})

const followingSchema = new Mongoose.Schema({
  _id: { type: String },
  person: { type: String, ref: 'Person' },
  project: { type: String, ref: 'Project' }
})

const personSchema = new Mongoose.Schema({
  _id: { type: String },
  name: { type: String },
  credentials: [credentialSchema],
  followings: [followingSchema]
})

const Person = Mongoose.model('Person', personSchema, 'people')

Person.prototype.hasCredentialWithId = function hasCredentialWithId (id) {
  return this.credentials.find(credential => credential.id === id)
}
Person.prototype.addCredential = function addCredential (credential) {
  this.credentials.push(credential)
  return this.save()
}

Person.prototype.getProfile = function getProfile () {
  let profile = {
    _id: this._id,
    name: this.name,
    followings: this.followings
  }
  return profile
}

module.exports = Person
