const NotificationsController = require('./../controllers/notifications')

module.exports = [
  {
    method: 'PUT',
    path: '/notifications/{id}',
    config: {
      handler: NotificationsController.save
    }
  },
  {
    method: 'GET',
    path: '/people/{id}/notifications',
    config: {
      handler: NotificationsController.mine
    }
  }]
