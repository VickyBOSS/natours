const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 60,
  },
  email: {
    type: String,
    // validate(email) {
    //   const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //   return re.test(String(email).toLowerCase());
    // },
  },
  img: String,
  thumb: String,
});

const User = mongoose.model('User', schema);

module.exports = User;
