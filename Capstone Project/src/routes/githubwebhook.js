const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const Slack = require('../services/slackClient');
const DeploymentRun = require('../models/deploymentRun');
const Audit = require('../models/auditLog');

const router = express.Router();
const secret = process.env.GITHUB_WEBHOOK_SECRET || '';

router.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const event = req.headers['x-github-event'];
  const id = req.headers['x-github-delivery'];

  // verify signature
  const hmac = 'sha256=' + crypto.createHmac('sha256', secret).update(req.body).digest('hex');
  if (!signature || !crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))) {
    return res.status(401).send('Invalid signature');
  }

  const payload = JSON.parse(req.body.toString('utf8'));
  // Only react to workflow_run and workflow_job for Actions
  try {
    if (event === 'workflow_run') {
      const run = payload.workflow_run;
      const correlationId = run.head_commit && run.head_commit.message && extractCorrelationId(run.head_commit.message); // or use input
      // find deployment run by correlationId or repository/run id
      const dr = await DeploymentRun.findOne({ 'git.runId': run.id }) || (correlationId && await DeploymentRun.findOne({ correlationId }));
      if (dr) {
        // map status -> dr.state & update slack message
        dr.state = run.conclusion || run.status;
        dr.git = dr.git || {};
        dr.git.runId = run.id;
        if (run.status === 'in_progress') dr.startedAt = new Date(run.updated_at);
        if (run.status === 'completed') dr.finishedAt = new Date(run.updated_at);
        await dr.save();

        // Post threaded update to Slack
        const text = `Workflow ${run.name} is ${run.status}${run.conclusion ? ` (${run.conclusion})` : ''}`;
        await Slack.postMessage(dr.slack.channel, {
          text,
          thread_ts: dr.slack.ts
        });

        await Audit.create({ type: 'webhook', user: 'github', correlationId: dr.correlationId, payload: run });
      }
    }
    // respond quickly
    res.status(200).send('ok');
  } catch (err) {
    console.error(err);
    res.status(500).send('error');
  }
});

function extractCorrelationId(msg) {
  // If you embed correlationId in commit message or inputs; implement accordingly
  const m = /correlationId=([0-9a-f-]+)/.exec(msg || '');
  return m && m[1];
}

module.exports = router;
