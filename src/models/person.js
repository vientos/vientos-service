const Mongoose = require('mongoose')
const webpush = require('web-push')
const cuid = require('cuid')
const schema = require('./schemas').person

const Notification = require('./notification')

webpush.setGCMAPIKey(process.env.GCM_API_KEY)

const Person = Mongoose.model('Person', schema, 'people')

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
    favorings: this.favorings,
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

Person.prototype.notify = function (conversation, message) {
  let notification = new Notification({
    // FIXME define all namespaces in single place
    _id: process.env.OAUTH_CLIENT_DOMAIN + '/notifications/' + cuid(),
    for: this._id,
    object: conversation._id
  })
  if (message) notification.cause = message._id
  notification.save()
    .catch(err => console.log(err))
  if (this.subscriptions.length) {
    // FIXME i18n
    let body = message ? 'New message' : 'New conversation started'
    this.sendPushNotification({
      body,
      iri: conversation._id
    })
  }
}

Person.prototype.sendPushNotification = function sendPushNotification (data) {
  this.subscriptions.forEach(subscription => {
    webpush.sendNotification(subscription, JSON.stringify(data))
      .catch(err => console.log(err))
  })
}

module.exports = Person
