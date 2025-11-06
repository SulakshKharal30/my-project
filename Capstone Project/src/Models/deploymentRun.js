const mongoose = require('mongoose');

const DeploymentRunSchema = new mongoose.Schema({
  correlationId: { type: String, index: true, unique: true },
  service: String,
  version: String,
  env: String,
  state: String, // requested, running, succeeded, failed, canceled
  slack: { channel: String, ts: String },
  initiatedBy: String,
  git: {
    owner: String,
    repo: String,
    runId: Number
  },
  startedAt: Date,
  finishedAt: Date,
  logs: [ { timestamp: Date, message: String } ]
}, { timestamps: true });

module.exports = mongoose.model('DeploymentRun', DeploymentRunSchema);
