const Mongoose = require('mongoose')

const credentialSchema = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String },
  // TODO: rename to providerId
  id: { type: String },
  email: { type: String },
  provider: { type: String }
})

const followingSchema = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String },
  person: { type: String, ref: 'Person' },
  project: { type: String, ref: 'Project' }
})

const personSchema = new Mongoose.Schema({
  _id: { type: String },
  type: { type: String },
  name: { type: String },
  logo: { type: String },
  credentials: [credentialSchema],
  categories: [{ type: String }],
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

// needed not to leak credentials
Person.prototype.getProfile = function getProfile () {
  return {
    _id: this._id,
    type: this.type,
    name: this.name,
    logo: this.logo,
    followings: this.followings,
    categories: this.categories
  }
}

Person.prototype.getPublicProfile = function getPublicProfile () {
  return {
    _id: this._id,
    type: this.type,
    name: this.name,
    logo: this.logo
  }
}

module.exports = Person
