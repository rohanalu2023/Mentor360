const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    //enum: ['Career Advice', 'Resume Review', 'Mock Interview'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
  ,
  pictureUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Content', contentSchema);
