const Mongoose = require('mongoose')

const credentialSchema = new Mongoose.Schema({
  id: { type: String },
  email: { type: String },
  provider: { type: String }
})

const personSchema = new Mongoose.Schema({
  name: { type: String },
  credentials: [credentialSchema],
  follows: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Project' }]
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
    follows: this.follows
  }
  return profile
}

module.exports = Person
