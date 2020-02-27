
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: 'Please enter username', unique: true },
  password: { type: String, required: 'Please enter password' },
  role: { type: String, required: 'Please choose role' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;