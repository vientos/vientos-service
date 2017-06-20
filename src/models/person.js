const Mongoose = require('mongoose')
const webpush = require('web-push')
const cuid = require('cuid')
const schema = require('./schemas').person
const Mailjet = require('node-mailjet').connect(
  process.env.MAILJET_APIKEY_PUBLIC,
  process.env.MAILJET_APIKEY_SECRET
)
const FROM_EMAIL = process.env.FROM_EMAIL

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

// FIXME i18n and handle new review
function subjectForNotification (notification, message) {
  if (!notification.cause) return 'New conversation started'
  return message.type === 'Message' ? 'New message' : 'New review'
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
    let body = subjectForNotification(notification, message)
    this.sendPushNotification({
      body,
      iri: conversation._id
    })
  }
  // TODO: check if email notifications on in settings
  this.sendEmailNotification(notification, message)
}

Person.prototype.sendPushNotification = function sendPushNotification (data) {
  this.subscriptions.forEach(subscription => {
    webpush.sendNotification(subscription, JSON.stringify(data))
      .catch(err => console.log(err))
  })
}

Person.prototype.sendEmailNotification = function sendEmailNotification (notification, message) {
  const emailData = {
    FromEmail: FROM_EMAIL,
    Recipients: [{ Email: this.credentials[0].email }],
    Subject: 'Vientos - ' + subjectForNotification(notification, message),
    // TODO: decuple from app
    'Text-part': process.env.PWA_URL + '/conversation/' +
      notification.object.split('/').pop()
  }
  return Mailjet.post('send').request(emailData)
}

module.exports = Person
