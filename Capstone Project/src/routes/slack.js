const express = require('express');
const bodyParser = require('body-parser');
const qs = require('qs');
const verifySlackSignature = require('../middleware/verifySlackSignature');
const SlackClient = require('../services/slackClient');
const DeploymentManager = require('../services/deploymentManager');
const { createAudit } = require('../models/auditLog');

const router = express.Router();
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const rawBodyMiddleware = bodyParser.raw({ type: '*/*' });

/**
 * Slash command endpoint
 * Slack signs the raw request body, so we must use raw middleware then parse.
 */
router.post('/commands', rawBodyMiddleware, (req, res, next) => {
  // attach raw body for signature verification
  req.rawBody = req.body.toString('utf8');
  // verify signature
  return verifySlackSignature(signingSecret)(req, res, async (err) => {
    if (err) return next(err);
    // Slack sends urlencoded payload as raw text
    const parsed = qs.parse(req.rawBody);
    const { command, user_id, text, response_url, channel_id } = parsed;

    try {
      // Basic parsing: e.g., /deploy service=api version=1.2 env=staging
      // we provide guided modal for richer UX
      if (command === '/deploy') {
        // open a deploy modal (async response)
        await SlackClient.openDeployModal({ trigger_id: parsed.trigger_id, channel: channel_id });
        // immediate 200 to Slack
        res.status(200).send('');
        // audit
        await createAudit({ type: 'slash', command, user: user_id, raw: parsed });
        return;
      }

      if (command === '/status') {
        const message = await DeploymentManager.getStatusText(text);
        res.json({ text: message, response_type: 'in_channel' });
        await createAudit({ type: 'slash', command, user: user_id, raw: parsed });
        return;
      }

      res.json({ text: `Unknown command ${command}`, response_type: 'ephemeral' });
    } catch (err) {
      next(err);
    }
  });
});

/**
 * Interactive actions — Slack sends JSON payload in 'payload' form field; signed similarly.
 */
router.post('/actions', rawBodyMiddleware, (req, res, next) => {
  req.rawBody = req.body.toString('utf8');
  return verifySlackSignature(signingSecret)(req, res, async (err) => {
    if (err) return next(err);
    // Slack posts application/x-www-form-urlencoded with payload=JSONstring
    const parsed = qs.parse(req.rawBody);
    const payload = JSON.parse(parsed.payload);
    // handle different action types: block_actions, view_submission, etc.
    try {
      if (payload.type === 'view_submission') {
        const values = payload.view.state.values;
        // extract selections and trigger deployment
        const deploySpec = DeploymentManager.parseModalValues(values);
        const correlationId = await DeploymentManager.startDeployment({
          ...deploySpec,
          initiatedBy: payload.user.id,
          channel: payload.view.private_metadata // optionally store channel
        });
        // respond with 200 to close modal
        res.status(200).json({ response_action: 'clear' });
        await createAudit({ type: 'modal', user: payload.user.id, raw: payload, correlationId });
        return;
      } else if (payload.type === 'block_actions') {
        // handle approve / rollback / cancel buttons
        const action = payload.actions[0];
        await DeploymentManager.handleAction(action, payload);
        res.status(200).send('');
        return;
      } else {
        res.status(200).send('');
      }
    } catch (err) {
      next(err);
    }
  });
});

/**
 * OAuth redirect (simplified)
 */
router.get('/oauth/callback', async (req, res) => {
  // Exchange code for tokens; store tokens securely (not shown)
  res.send('Installed! You can close this window.');
});

module.exports = router;
