var url      = require('url'),
    fixtures = require('./fixtures');

require('http').createServer(function (req, res) {
  var serve = url.parse(req.url).pathname.split('/')[1];

  if (req.method === 'POST') {
    parsePostData(req, function (data) {
      var respondWith = (data.foo === 'bar') ? '<h1>was posted</h1>'
                                             : '<h1>test should fail</h1>';
      res.writeHead(200, getResponseHeaders('html'));
      res.end(respondWith);
    });
  } else {
    res.writeHead(200, getResponseHeaders(serve));
    res.end(fixtures.documents[serve]);
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

function getResponseHeaders (serve) {
  var ct = {
        'html': 'text/html',
        'json': 'application/json',
        'feed': 'application/atom+xml',
        'xml' : 'text/xml'
      };
  return {
    'Content-type': ct[serve],
    'X-Powered-By': 'Noodle testing server',
    'Link'        : '<foo>; rel="next",<bar>; rel="last"'
  };
}