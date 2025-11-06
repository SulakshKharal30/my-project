const mongoose = require('mongoose');

const WorkflowMapSchema = new mongoose.Schema({
  // Name of the service
  service: {
    type: String,
    required: true,
    trim: true
  },

  // Environment name (staging, production, etc.)
  environment: {
    type: String,
    required: true,
    trim: true
  },

  // GitHub Actions workflow file or ID to run
  workflow: {
    type: String,
    required: true,
    trim: true
  },

  // Branches allowed for this workflow
  branchAllowlist: {
    type: [String],
    default: ['main']
  },

  // Optional metadata
