'use strict';
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // RFC 5322 compliant email regex pattern
        const emailRegex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(value);
      },
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
});

module.exports = mongoose.model('User', userSchema);
