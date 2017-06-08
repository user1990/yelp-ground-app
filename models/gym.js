'use strict';
const mongoose = require('mongoose');

// MONGOOSE/MODEL CONFIG
let gymSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Gym', gymSchema);

