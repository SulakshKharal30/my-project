const { v4: uuidv4 } = require('uuid');
const GitHub = require('./githubClient');
const Slack = require('./slackClient');
const Audit = require('../models/auditLog');
const DeploymentRun = require('../models/deploymentRun');
const RBAC = require('../models/user'); // placeholder for permission checks

async function startDeployment({ service, version, env, initiatedBy, channel }) {
  // validation + RBAC check (simplified)
  // check concurrency/cooldown; check required approvals for production
  const correlationId = uuidv4();

  // Create an in-flight record
  const run = await DeploymentRun.create({
    correlationId,
    service,
    version,
    env,
    state: 'requested',
    initiatedBy,
    channel
  });

  // Post an initial message to slack
  const slackMsg = {
    text: `Deployment requested ${service}@${version} -> ${env}`,
    attachments: []
  };
  const msg = await Slack.postMessage(channel, slackMsg);

  // Persist Slack message ts to update later
  run.slack = { channel, ts: msg.ts };
  await run.save();

  // Trigger workflow via GitHub
  // Lookup workflow mapping from DB (omitted) — using placeholder owner/repo/workflow_id
  const owner = 'your-org';
  const repo = service; // assuming mapping
  const workflow_id = 'deploy.yml';
  await GitHub.dispatchWorkflow({ owner, repo, workflow_id, ref: version, inputs: { environment: env, correlationId } });

  // audit
  await Audit.create({
    type: 'deploy_requested',
    user: initiatedBy,
    correlationId,
    payload: { service, version, env }
  });

  return correlationId;
}

function parseModalValues(values) {
  return {
    service: values.service_block.service.value,
    version: values.version_block.version.value,
    env: values.env_block.env.value
  };
}

async function handleAction(action, payload) {
  // Example button actions: approve, cancel, rollback
  const name = action.action_id || action.value;
  if (name === 'approve_production') {
    // mark approved, then trigger run
  } else if (name === 'cancel_deploy') {
    // cancel run via GitHub
  }
}

async function getStatusText(query) {
  // Implement lookup of runs or latest state
  return 'Status lookup not implemented yet';
}

module.exports = {
  startDeployment,
  parseModalValues,
  handleAction,
  getStatusText
};
