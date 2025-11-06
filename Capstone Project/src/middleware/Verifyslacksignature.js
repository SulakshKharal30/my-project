const crypto = require('crypto');

function verifySlackSignature(signingSecret) {
  return (req, res, next) => {
    try {
      const timestamp = req.headers['x-slack-request-timestamp'];
      const sig = req.headers['x-slack-signature'];
      if (!timestamp || !sig) return res.status(400).send('Missing Slack signature headers');

      // prevent replay: reject requests older than 5 minutes
      const fiveMinutes = 60 * 5;
      if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > fiveMinutes) {
        return res.status(400).send('Stale request');
      }

      const raw = req.rawBody || req.bodyRaw || JSON.stringify(req.body);
      const base = `v0:${timestamp}:${raw}`;
      const hmac = 'v0=' + crypto.createHmac('sha256', signingSecret).update(base).digest('hex');

      if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(sig))) {
        return res.status(401).send('Invalid signature');
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = verifySlackSignature;
