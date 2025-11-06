/**
 * mock-github-webhook.js
 * 
 * Simulates GitHub Actions webhook events locally for testing.
 * Usage:
 *   node scripts/mock-github-webhook.js
 */

const axios = require('axios');
const crypto = require('crypto');

const BOT_WEBHOOK_URL = process.env.LOCAL_BOT_WEBHOOK_URL || 'http://localhost:3000/github/webhook';
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'testsecret';

// Example mock payload
const payload = {
  workflow: 'Deploy Service',
  action: 'completed',
  workflow_run: {
    id: 123456,
    status: 'completed',
    conclusion: 'success',
    head_branch: 'main',
    head_sha: 'abcdef1234567890',
    name: 'Deploy Service',
    run_number: 42
  },
  repository: {
    name: 'example-service',
    owner: { login: 'example-org' }
  }
};

// Generate X-Hub-Signature-256 header
function generateSignature(secret, body) {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
}

async function sendWebhook() {
  const body = JSON.stringify(payload);
  const signature = generateSignature(GITHUB_WEBHOOK_SECRET, body);

  try {
    const res = await axios.post(BOT_WEBHOOK_URL, body, {
