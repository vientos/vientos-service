const Mongoose = require('mongoose')
const schema = require('./schemas').matching
const Intent = require('./intent')
const Project = require('./project')

const Matchings = Mongoose.model('Matchings', schema, 'matchings')

Matchings.prototype.authorized = async function authorized (personId) {
  let intents = await Intent.find({_id: {$in: this.intents}})
  let projectIds = intents[0].projects.concat(intents[1].projects)
  return Project.findOne({
    _id: {$in: projectIds},
    admins: personId
  })
}
module.exports = Matchings
