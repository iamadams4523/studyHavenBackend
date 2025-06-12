const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
  },
  username: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  image: String,
});

module.exports = mongoose.model('User', UserSchema);
