const Mongoose = require('mongoose')
const ObjectId = Mongoose.Schema.Types.ObjectId

const intentSchema = new Mongoose.Schema({
  projects: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  title: { type: String },
  description: { type: String },
  status: { type: String, default: 'active' },
  direction: { type: String }, // offer || request
  collaborationType: { type: String } // TODO: ref ?
})

const Intent = Mongoose.model('Intent', intentSchema, 'intents')

module.exports = Intent
