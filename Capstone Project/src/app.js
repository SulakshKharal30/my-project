const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const pinoHttp = require('pino-http')();
const slackRouter = require('./routes/slack');
const githubWebhookRouter = require('./routes/githubWebhook');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Important: GitHub webhooks need raw body for signature verification.
// We'll parse JSON by routes selectively. For slack routes, we parse urlencoded.
app.use(helmet());
app.use(pinoHttp);

// Slack routes will parse urlencoded and json inside the route file.
// For GitHub webhooks we will use raw body parser in that route file using express.raw.

app.use('/slack', slackRouter);
app.use('/github/webhook', githubWebhookRouter);

app.use(errorHandler);

module.exports = app;
