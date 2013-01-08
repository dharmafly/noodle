var url      = require('url'),
    fixtures = require('./fixtures');

require('http').createServer(function (req, res) {
  var serve = url.parse(req.url).pathname.split('/')[1];
  switch (serve) {
    case 'html':
      res.writeHead(200, {'Content-type':'text/html'});
      break;
    case 'json':
      res.writeHead(200, {'Content-type':'application/json'});
      break;
    case 'feed':
      res.writeHead(200, {'Content-type':'application/atom+xml'});
      break;
    case 'xml':
      res.writeHead(200, {'Content-type':'text/xml'});
      break;
  }
  res.end(fixtures.documents[serve] || 'specify document type as url path');
}).listen(8889);

console.log('Test server running on port 8889');