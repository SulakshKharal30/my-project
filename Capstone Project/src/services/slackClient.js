const axios = require('axios');

const slackToken = process.env.SLACK_BOT_TOKEN;
const api = axios.create({
  baseURL: 'https://slack.com/api',
  headers: { Authorization: `Bearer ${slackToken}` }
});

async function openDeployModal({ trigger_id, channel }) {
  // Compose a modal payload: pick service, version, environment
  const modal = {
    trigger_id,
    view: {
      type: 'modal',
      callback_id: 'deploy_modal_v1',
      title: { type: 'plain_text', text: 'Deploy' },
      submit: { type: 'plain_text', text: 'Deploy' },
      close: { type: 'plain_text', text: 'Cancel' },
      private_metadata: channel,
      blocks: [
        // service select (we could fetch dynamic list)
        {
          type: 'input',
          block_id: 'service_block',
          label: { type: 'plain_text', text: 'Service' },
          element: { type: 'plain_text_input', action_id: 'service' }
        },
        {
          type: 'input',
          block_id: 'version_block',
          label: { type: 'plain_text', text: 'Version / Ref' },
          element: { type: 'plain_text_input', action_id: 'version' }
        },
        {
          type: 'input',
          block_id: 'env_block',
          label: { type: 'plain_text', text: 'Environment' },
          element: { type: 'plain_text_input', action_id: 'env' }
        }
      ]
    }
  };
  await api.post('/views.open', modal);
}

async function postMessage(channel, message) {
  const { data } = await api.post('/chat.postMessage', {
    channel,
    ...message
  });
  return data;
}

async function updateMessage(channel, ts, message) {
  const { data } = await api.post('/chat.update', {
    channel,
    ts,
    ...message
  });
  return data;
}

module.exports = {
  openDeployModal,
  postMessage,
  updateMessage
};
