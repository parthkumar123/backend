'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import User and BlacklistToken models
const User = require('../models/User');
const BlacklistToken = require('../models/BlacklistToken');

// Function to generate JWT token
const generateToken = userId => {
  // Generate and return token based on provided userid
  return jwt.sign({ userId }, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_TOKEN_EXPIRYTIME,
  });
};

exports.signup = async (req, res) => {
  try {
    // Fetch email and password from request body
    const { email, password } = req.body;

    // Basic validation on the server side
    if (!email || !password) {
      return res.status(400).send({
        status: 'error',
        message: 'Email and password are required.',
      });
    }

    // Basic password strength validation
    if (password.length < 6) {
      return res.status(400).send({
        status: 'error',
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Hash user password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store email and hashed password in User collection
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Send a success message
    return res.status(201).send({
      status: 'success',
      message: 'User registered successfully.',
    });
  } catch (err) {
    // Handle the duplicate key error
    if (err.code === 11000) {
      return res.status(409).send({
        status: 'error',
        message: 'Email already exists. Please use a different email address.',
      });
    }
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).send({
        status: 'error',
        message: messages.join(', '),
      });
    }
    // Handle other errors
    return res.status(500).send({
      status: 'error',
      message: 'An error occurred while registering the user.',
    });
  }
};

exports.login = async (req, res) => {
  try {
    // Fetch email and password from request body
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).send({
        status: 'error',
        message: 'Email and password are required.',
      });
    }

    // Normalize email (convert to lowercase)
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    // Check whether user exists or not
    if (!user) {
      return res.status(401).send({
        status: 'error',
        message: 'Email not registered. Please check your email or sign up.',
      });
    }

    // Check whether password is correct or not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Passwords don't match
      return res.status(401).send({
        status: 'error',
        message: 'Invalid password. Please try again.',
      });
    }

    // Generate token based on userid
    const token = generateToken(user._id);

    // Passwords match
    return res.send({
      status: 'ok',
      token: token,
    });
  } catch (err) {
    // Handle errors
    return res.status(500).send({
      status: 'error',
      message: 'An error occurred while logging in the user.',
      error: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization?.split(' ')?.[1];
    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Authorization token is required',
      });
    }

    // Add token to blacklist
    const blacklistedToken = new BlacklistToken({ token });
    await blacklistedToken.save();

    // Return logout successful message
    return res.json({
      status: 'success',
      message: 'Logout successful',
    });
  } catch (err) {
    // Return err message with consistent format
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while logging out',
      error: err.message,
    });
  }
};
