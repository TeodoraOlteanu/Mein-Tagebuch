const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const abcSchema = new Schema({
  name: { type: String, required: true, unique: true, maxlength: 10000 },
  activating_event: { type: String, maxlength: 10000 },
  beliefs: { type: String, maxlength: 10000 },
  consequences: { type: String, maxlength: 10000 },
  disputation: { type: String, maxlength: 10000 },
  new_beliefs: { type: String, maxlength: 10000 },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }  // Reference to User
}, {
  timestamps: true
});

// Create a model from the schema
const ABC = mongoose.model('ABC', abcSchema);

module.exports = ABC;
