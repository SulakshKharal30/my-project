const express = require('express');
const cardRoutes = require('./routes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Playing Cards API! Try /cards to see all cards.');
});
