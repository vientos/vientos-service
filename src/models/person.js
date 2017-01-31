const Mongoose = require('mongoose')
const ObjectId = Mongoose.Schema.Types.ObjectId

const credentialSchema = new Mongoose.Schema({
  id: { type: String },
  email: { type: String },
  provider: { type: String }
})

const personSchema = new Mongoose.Schema({
  credentials: [credentialSchema],
  follows: [{ type: ObjectId, ref: 'Project' }]
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
  return {
    '_id': this._id
  }
}

module.exports = Person
