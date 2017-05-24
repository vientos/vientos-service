const PlacesController = require('./../controllers/places')

module.exports = [
  {
    method: 'GET',
    path: '/places',
    config: {
      handler: PlacesController.list,
      auth: false
    }
  },
  {
    method: 'PUT',
    path: '/places/{id}',
    config: {
      handler: PlacesController.save
    }
  }
]
