const http = require('http');

function Handler0(req, res)  {
 res.statusCode = 200;
 res.setHeader('Content-Type', 'text/plain');
 res.end('Hello, World!\n');
}

const Handler1 = function(req, res)  {
 res.statusCode = 200;
 res.setHeader('Content-Type', 'text/plain');
 res.end('Hello, World!\n');
}

const Handler2 = function(req, res)  {
 res.statusCode = 200;
 res.setHeader('Content-Type', 'text/plain');
 res.end('Hello, World!\n');
}

const server = http.createServer(Handler1);

const port = 3000;
server.listen(port, () => {
 console.log(`Server running at http://localhost:${port}`);
});