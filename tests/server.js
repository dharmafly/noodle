var url      = require('url'),
    fixtures = require('./fixtures');

require('http').createServer(function (req, res) {
  var serve = url.parse(req.url).pathname.split('/')[1],
      ct    = {
        'html': 'text/html',
        'json': 'application/json',
        'feed': 'application/atom+xml',
        'xml':  'text/xml'
      };

  res.writeHead(200, {'Content-type': ct[serve]});
  res.end(fixtures.documents[serve] || 'specify document type as url path');
})
.listen(8889, function () {
  console.log('Test server temporarily running on port 8889');
});