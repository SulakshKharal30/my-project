const express = require('express');
const app = express();
const port = 3000;
const handlerGet = (request, response) => {
 response.send("URL:"+request.url + " Method:"+request.method);
};
// Define a route for GET requests to the root path
app.get('/', handlerGet);

// Define a route for POST requests to /submit
app.post('/submit', (req, res) => {
 res.send('Data submitted!');
});

// Start the server
app.listen(port, () => {
 console.log(`Server running on http://localhost:${port}`);
});