const ConversationsController = require('./../controllers/conversations')

module.exports = [
  {
    method: 'GET',
    path: '/conversations/{id}',
    config: {
      handler: ConversationsController.view
    }
  },
  {
    method: 'GET',
    path: '/people/{id}/conversations',
    config: {
      handler: ConversationsController.mine
    }
  },
  {
    method: 'PUT',
    path: '/conversations/{id}',
    config: {
      handler: ConversationsController.create
    }
  },
  {
    method: 'PUT',
    path: '/messages/{id}',
    config: {
      handler: ConversationsController.addMessage
    }
  }]
