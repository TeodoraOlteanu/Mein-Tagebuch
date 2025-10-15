const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User model
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    is_verified: { type: Boolean, default: false }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
