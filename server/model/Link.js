const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true
  },
  name:{
    type: String,
  },
  data: [
    {
      price: {
        type: String
      },
      reviews: {
        type: Number
      },
      ratings: {
        type: Number
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ]
});

const Link = mongoose.model("link", userSchema);

module.exports = Link;
