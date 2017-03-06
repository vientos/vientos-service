const Mongoose = require('mongoose')

const intentSchema = new Mongoose.Schema({
  _id: { type: String },
  projects: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  title: { type: String },
  description: { type: String },
  status: { type: String, default: 'active' },
  direction: { type: String }, // offer || request
  collaborationType: { type: String } // TODO: ref ?
})

const Intent = Mongoose.model('Intent', intentSchema, 'intents')

module.exports = Intent
