require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/service');
const Environment = require('../models/environment');
const User = require('../models/user');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  await Service.deleteMany({});
  await Environment.deleteMany({});
  await User.deleteMany({});

  await Service.create({
    name: 'api',
    repoOwner: 'your-org',
    repoName: 'api',
    defaultWorkflow: 'deploy.yml',
    branchAllowlist: ['main', 'release/*'],
    concurrency: 1
  });

  await Environment.create({
    name: 'staging',
    requiresApproval: false
  });

  await Environment.create({
    name: 'production',
    requiresApproval: true,
    cooldownMinutes: 10
  });

  await User.create({
    slackId: 'U12345',
    username: 'deploy-bot-admin',
    roles: ['admin'],
    allowedEnvironments: ['staging', 'production']
  });

  console.log('Seeded initial documents');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
