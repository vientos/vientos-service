const cuid = require('cuid')
const labels = require('vientos-data').labels.service

const Notification = require('./models/notification')
const Conversation = require('./models/conversation')
const Intent = require('./models/intent')
const Person = require('./models/person')

const bus = require('./bus')

const Mailjet = require('node-mailjet').connect(
  process.env.MAILJET_APIKEY_PUBLIC,
  process.env.MAILJET_APIKEY_SECRET
)
const FROM_EMAIL = process.env.FROM_EMAIL

const webpush = require('web-push')
if (process.env.GCM_API_KEY) {
  webpush.setGCMAPIKey(process.env.GCM_API_KEY)
}

/**
 * Actions resulting in notifications and Recipients
 * * Conversation started - notify all admins of the causing intent
 * * TODO: Matchin intent added - notify all admins of the matching intent
 * * Message sent
 *   * if no matchin intent - notify conversation creator + causing intent admins - message creator
 *   * i matching intent - noify causing intent admins + matchin intent admins - message creator
 * * Review send - same as Message sent
 * TODO align with Conversation.canEngage()
 */

async function selectRecipients (conversation, messageOrReview) {
  // include admins of the causing intent
  const causingIntent = await Intent.findById(conversation.causingIntent)
  let recipients = [...causingIntent.admins]
  if (messageOrReview) {
    if (conversation.matchingIntent) {
      // include admins of the matching intent
      const matchingIntent = await Intent.findById(conversation.matchingIntent)
      recipients = [...matchingIntent.admins, ...recipients]
    } else {
      // include creator of the conversation
      recipients = [conversation.creator, ...recipients]
    }
    // exclude creator of the message or the review
    recipients = recipients.filter(personId => personId !== messageOrReview.creator)
  }
  return recipients
}

async function handleUpdate (entity) {
  let conversation
  let messageOrReview
  if (entity.type === 'Conversation') {
    conversation = entity
  } else if (entity.type === 'Message' || entity.type === 'Review') {
    messageOrReview = entity
    conversation = await Conversation.findById(messageOrReview.conversation)
  } else return
  let recipientsIds = await selectRecipients(conversation, messageOrReview)
  let recipients = await Person.find({_id: {$in: recipientsIds}})
  return Promise.all(recipients.map(person => notify(person, conversation, messageOrReview)))
}

// delivery

async function notify (person, conversation, message) {
  let notification = new Notification({
    // FIXME define all namespaces in single place
    _id: process.env.SERVICE_URL + '/notifications/' + cuid(),
    for: person._id,
    object: conversation._id
  })
  if (message) notification.cause = message._id
  await notification.save()
  bus.emit('notification', notification._doc)
  let push
  if (person.subscriptions.length) {
    let body = subjectForNotification(notification, message, person.language)
    push = sendPushNotification(person.subscriptions, {
      body,
      iri: conversation._id
    })
  }
  let email
  if (person.emailNotifications) {
    email = sendEmailNotification(person, notification, message)
  }
  return Promise.all([push, email])
}

function subjectForNotification (notification, message, language) {
  if (!notification.cause) return labels[language]['subject:new-conversation']
  return message.type === 'Message'
    ? labels[language]['subject:new-message']
    : labels[language]['subject:new-review']
}

function sendPushNotification (subscriptions, data) {
  return Promise.all(subscriptions.map(subscription => {
    return webpush.sendNotification(subscription, JSON.stringify(data))
  }))
}

function sendEmailNotification (person, notification, message) {
  const emailData = {
    FromEmail: FROM_EMAIL,
    Recipients: [{ Email: person.credentials[0].email }],
    Subject: 'Vientos - ' + subjectForNotification(notification, message, person.language),
    // TODO: decuple from app
    'Text-part': process.env.APP_URL + '/conversation/' +
      notification.object.split('/').pop()
  }
  return Mailjet.post('send').request(emailData)
}

module.exports = handleUpdate
