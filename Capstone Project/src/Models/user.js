const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Slack user ID
  slackId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Human-readable Slack username
  username: {
    type: String,
    required: true,
    trim: true
  },

  // Roles assigned to the user (e.g., admin, dev, ops)
  roles: {
    type: [String],
    default: ['dev'],
    valid
