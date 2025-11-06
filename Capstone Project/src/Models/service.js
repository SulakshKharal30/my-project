const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  // Name of the service (unique)
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },

  // GitHub repository owner
  repoOwner: { 
    type: String, 
    required: true 
  },

  // GitHub repository name
  repoName: { 
    type: String, 
    required: true 
  },

  // Default workflow file for this service
  defaultWorkflow: { 
    type: String, 
    required: true 
  },

  // Branches allowed for deployment
  branchAllowlist: { 
    type: [String], 
    default: ['main'] 
  },

  // Maximum concurrent deployments allowed for
