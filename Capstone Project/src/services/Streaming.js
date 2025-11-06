/**
 * src/services/Streaming.js
 * 
 * Streams GitHub Actions workflow events to Slack channels/messages.
 */

const { WebClient } = require('@slack/web-api');
const AuditLog = require('../models/AuditLog');
const config = require('../../config');

class StreamingService {
  /**
   * @param {string} slackToken - Slack Bot token
   */
  constructor(slackToken) {
    this.slackClient = new WebClient(slackToken || config.slack.botToken);
  }

  /**
   * Post a new Slack message for deployment start
   * @param {string} channel - Slack channel ID
   * @param {string} text - Message text
   * @returns {object} Slack message response
   */
  async postDeploymentMessage(channel, text) {
    try {
      const res = await this.slackClient.chat.postMessage({
        channel,
        text,
        mrkdwn: true
      });
      return res;
    } catch (err) {
