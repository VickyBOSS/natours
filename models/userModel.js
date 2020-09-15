const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your name'],
    minlength: 2,
    maxlength: 60,
  },
  email: {
    type: String,
    required: [true, 'Please provide a email address'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a valid password'],
    minlength: [6, 'Password length must be equal to or above 5'],
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Password does not match!',
    },
  },
});

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const passHash = await bcrypt.hash(this.password, 12);
  this.password = passHash;

  this.confirmPassword = undefined;

  next();
});

schema.method.loginUsingEmailAndPassword = function (email, password) {};

const User = mongoose.model('User', schema);

module.exports = User;
