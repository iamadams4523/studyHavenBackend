const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['handout', 'past-question'], required: true },
    fileUrl: { type: String, required: true },
    image: { type: String, required: true },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Level',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);
