const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faculty', facultySchema);
