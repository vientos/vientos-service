
const ReviewsController = require('./../controllers/reviews')

module.exports = [
  {
    method: 'GET',
    path: '/reviews',
    config: {
      handler: ReviewsController.list,
      auth: false
    }
  },
  {
    method: 'PUT',
    path: '/reviews/{id}',
    config: {
      handler: ReviewsController.save
    }
  }]
