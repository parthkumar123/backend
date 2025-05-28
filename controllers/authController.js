"use strict";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import User and BlacklistToken models
const User = require('../models/User');
const BlacklistToken = require('../models/BlacklistToken');

// Function to generate JWT token
const generateToken = (userId) => {
    // Generate and return token based on provided userid
    return jwt.sign({ userId }, process.env.JWT_SECRETKEY, { expiresIn: process.env.JWT_TOKEN_EXPIRYTIME });
};

exports.signup = async (req, res) => {
    try {
        // Fetch username and password from request body
        const { username, password } = req.body;

        // Hash user password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store username and hashed password in User collection
        const user = new User({ username, password: hashedPassword });
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
                message: 'Username already exists. Please choose a different username.',
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
        // Fetch username and password from request body
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        // Check wether user exists or not
        if (!user) {
            throw new Error('User not found');
        };

        // Check wether password is correct or not
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Passwords don't match
            return res.status(401).send({
                status: 'error',
                message: 'Invalid password. Please try again.',
            });
        };

        // Generate token based on userid
        const token = generateToken(user._id);

        // Passwords match
        return res.send({
            status: 'ok',
            token: token
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
            throw new Error('Token not found');
        };

        // Add token to blacklist
        const blacklistedToken = new BlacklistToken({ token });
        await blacklistedToken.save();

        // Return logout successful message
        return res.json({ message: 'Logout successful' });
    } catch (err) {
        // Return err message
        return res.status(500).json({ error: err.message });
    }
};
