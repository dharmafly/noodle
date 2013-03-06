var url      = require('url'),
    fixtures = require('./fixtures');

require('http').createServer(function (req, res) {
  var serve = url.parse(req.url).pathname.split('/')[1],
      ct    = {
        'html': 'text/html',
        'json': 'application/json',
        'feed': 'application/atom+xml',
        'xml' : 'text/xml'
      };


  if (req.method === 'POST') {
    parsePostData(req, function (data) {
      res.writeHead(200, {
        'Content-type': ct['html'],
        'X-Powered-By': 'Noodle testing server'
      });
      res.end('<html><body><h1>was posted</h1></body></html>');
    });
  } else {
    res.writeHead(200, {
      'Content-type': ct[serve],
      'X-Powered-By': 'Noodle testing server'
    });
    res.end(fixtures.documents[serve] || 'specify document type as url path');
  }
})
.listen(8889, function () {
  console.log('Test server temporarily running on port 8889');
});

function parsePostData (req, cb) {
  var body = '';

  req.on('data', function (data) {
      body += data;
  });

  req.on('end', function () {
    cb(require('querystring').parse(body));
  });
}