require('dotenv').config();
const path = require('path');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
  port: process.env.PORT || 3000,

  // MongoDB configuration
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chatops-bot',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // Slack configuration
  slack: {
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    botToken: process.env.SLACK_BOT_TOKEN,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    oauthRedirectUri: process.env.SLACK_OAUTH_REDIRECT_URI
  },

  // GitHub configuration
  github: {
    pat: process.env.GITHUB_PAT,
    apiBase: process.env.GITHUB_API_BASE || 'https://api.github.com',
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET
  },

  // RBAC and environment rules
  rbac: {
    roles: {
      admin: ['deploy', 'rollback', 'approve', 'manage_config'],
      dev: ['deploy', 'status'],
      ops: ['deploy', 'rollback', 'status', 'approve']
    },
    environments: {
      staging: { approvalRequired: false },
      production: { approvalRequired: true }
    }
  },

  // Logging & debugging
  log: {
    level: process.env.LOG_LEVEL || 'info',
    dir: path.join(__dirname, '../../logs')
  },

  // Retry & backoff settings
  retry: {
    maxAttempts: 5,
    initialDelayMs: 500,
    factor: 2
  },

  // Deployment defaults
  deployment: {
    defaultConcurrency: 1,
    cooldownMinutes: 5
  }
};
