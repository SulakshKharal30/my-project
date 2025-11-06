const mongoose = require('mongoose');

const EnvironmentSchema = new mongoose.Schema({
  // Name of the environment (e.g., staging, production)
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },

  // Does this environment require approval before deploys?
  requiresApproval: { 
    type: Boolean, 
    default: false 
  },

  // Minimum minutes to wait between deploys in this environment
  cooldownMinutes: { 
    type: Number, 
    default: 0,
    min: 0
  },

  // Maximum concurrent deployments allowed in this environment
  concurrencyLimit: { 
    type: Number, 
    default: 1,
    min: 1
  },

  // Optional description or notes
  description: { 
    type: String, 
    default: '' 
  }
}, { 
  timestamps: true // automatically adds createdAt and updatedAt
});

// Static method to check if a deployment is allowed based on cooldown
EnvironmentSchema.statics.isDeployAllowed = async function(envName) {
  const env = await this.findOne({ name: envName });
  if (!env) throw new Error(`Environment ${envName} not found`);
  return env;
};

module.exports = mongoose.model('Environment', EnvironmentSchema);
