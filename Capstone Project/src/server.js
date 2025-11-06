require('dotenv').config();
const http = require('http');
const app = require('./app');
const pino = require('pino')();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  pino.info('Starting ChatOps Deploy Bot...');
  // DB connect
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  pino.info('Connected to MongoDB');

  const server = http.createServer(app);
  server.listen(PORT, () => pino.info(`Server listening on ${PORT}`));

  // graceful shutdown
  const shutdown = async () => {
    pino.info('Shutting down...');
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch(err => {
  pino.error(err);
  process.exit(1);
});
