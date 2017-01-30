var Person = require('./../models/person')

function PersonController () { }
PersonController.prototype = (function () {
  return {
    follow (request, reply) {
      //TODO: change params.personId for auth.credentials.id
      Person.findByIdAndUpdate(
        request.params.personId,
        {$addToSet: {follows: request.params.projectId}}
      ).then(result => reply().code(204))
      .catch(err => reply(err))
    },
    unfollow (request, reply) {
      //TODO: change params.personId for auth.credentials.id
      Person.findByIdAndUpdate(
        request.params.personId,
        {$pull: {follows: request.params.projectId}}
      ).then(result => reply().code(204))
      .catch(err => reply(err))
    }
  }
})()
var PersonController = new PersonController()
module.exports = PersonController
