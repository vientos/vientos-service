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
  },
  {
    method: 'GET',
    path: '/places/states',
    config: {
      handler: PlacesController.states,
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/places/states/{stateId}/municipalities',
    config: {
      handler: PlacesController.municipalities,
      auth: false
    }
  }
]
