const axios = require('axios');
const retryWithBackoff = require('../utils/retryWithBackoff');

const GITHUB_BASE = process.env.GITHUB_API_BASE || 'https://api.github.com';
const GITHUB_PAT = process.env.GITHUB_PAT;

const api = axios.create({
  baseURL: GITHUB_BASE,
  headers: {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${GITHUB_PAT}`,
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

// Trigger a workflow dispatch
async function dispatchWorkflow({ owner, repo, workflow_id, ref, inputs = {} }) {
  return retryWithBackoff(async () => {
    const path = `/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`;
    await api.post(path, { ref, inputs });
    // Workflow dispatch has no immediate run id — we should rely on webhook events to stream run start
    return { dispatched: true };
  });
}

// Get a workflow run
async function getWorkflowRun(owner, repo, runId) {
  return retryWithBackoff(async () => {
    const res = await api.get(`/repos/${owner}/${repo}/actions/runs/${runId}`);
    return res.data;
  });
}

// Cancel run
async function cancelRun(owner, repo, runId) {
  return retryWithBackoff(async () => {
    await api.post(`/repos/${owner}/${repo}/actions/runs/${runId}/cancel`);
    return { canceled: true };
  });
}

// Re-run a workflow
async function reRun(owner, repo, runId) {
  return retryWithBackoff(async () => {
    await api.post(`/repos/${owner}/${repo}/actions/runs/${runId}/rerun`);
    return { rerun: true };
  });
}

module.exports = {
  dispatchWorkflow,
  getWorkflowRun,
  cancelRun,
  reRun
};
