"use strict";
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    dueDate: Date,
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    category: {
        type: String,
        enum: ['Work', 'Personal', 'Meeting', 'Development', 'Documentation'],
        default: 'Work'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

module.exports = mongoose.model('Task', taskSchema);
