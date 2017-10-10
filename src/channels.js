const SseChannel = require('sse-channel')
const bus = require('./bus')
const cuid = require('cuid')

const privateChannels = {}
const publicChannel = new SseChannel({ cors: { origins: ['*'] } })

const publicTypes = ['Person', 'Project', 'Intent', 'Place', 'Review']

bus.on('update', entity => {
  if (publicTypes.includes(entity.type)) {
    publicChannel.send({ event: 'update', id: cuid(), data: entity._id })
  }
})

bus.on('notification', notification => {
  let channel = privateChannels[notification.for]
  if (channel) channel.send({ event: 'notification', id: cuid(), data: notification._id })
})

function subscribe (request, response, personId) {
  if (personId) {
    let channel = privateChannels[personId]
    if (!channel) {
      channel = privateChannels[personId] = new SseChannel({ cors: { origins: ['*'] } })
    }
    channel.addClient(request, response)
  } else {
    publicChannel.addClient(request, response)
  }
}

module.exports = subscribe
