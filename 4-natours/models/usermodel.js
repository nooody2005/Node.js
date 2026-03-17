const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name :)'],
    unique: true,
    trim: true
    // maxlength: [40, 'name must be less than 40 characters'],
    // minlength: [10, 'name must be above 10 characters']
    // validate : [validator.isAlpha,'name should contains characters only :)']
  },
  email: {
    // type: email,
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    // type: photo
    type: String
  },
  password: {
    // type: password,
    type: String,
    required: [true, 'Please provide a password'],
    minlength:8
  },
  passwordConfirm: {
    type: passwordConfirm,
    required: [true, 'you must confirm your password']
  }
});


const User = mongoose.model('User',userSchema);

module.exports = User;
