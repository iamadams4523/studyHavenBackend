const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user', // ✅ default is user
    },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
