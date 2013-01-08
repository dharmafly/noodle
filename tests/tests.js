var fs       = require('fs'),
    http     = require('http'),
    assert   = require('assert'),
    expect   = require('chai').expect,
    fixtures = require('./fixtures'),
    noodle   = require('../lib/noodle'),
    cache    = require('../lib/cache'),
    html     = require('../lib/types/html'),
    json     = require('../lib/types/json'),
    feed     = require('../lib/types/feed'),
    xml      = require('../lib/types/xml'),
    serve    = 'html',
    server;


// Fake webserver for noodle tests
server = http.createServer(function (req, res) {
  switch (serve) {
    case 'html':
      res.writeHead(200, {'Content-type':'text/html'});
      res.end(fixtures.documents.html);
      break;
    case 'json':
      res.writeHead(200, {'Content-type':'application/json'});
      res.end(fixtures.documents.json);
      break;
    case 'feed':
      res.writeHead(200, {'Content-type':'application/atom+xml'});
      res.end(fixtures.documents.feed);
      break;
    case 'xml':
      res.writeHead(200, {'Content-type':'text/xml'});
      res.end(fixtures.documents.xml);
      break;
  }
}).listen(8889);
console.log('Test server temporarily running on port 8889');


noodle.configure({
  "resultsCacheMaxTime":   60480000,
  "resultsCachePurgeTime": 60480000,
  "resultsCacheMaxSize":   60480000,
  "pageCacheMaxTime":      60480000,
  "pageCachePurgeTime":    60480000,
  "pageCacheMaxSize":      60480000
});

describe('noodle', function () {
  describe('query()', function () {
    it('should return a promise', function () {
      var promise = noodle.query({url: 'foo'});
      assert.equal(true, isPromise(promise));
    });
  });

  describe('fetch()', function () {
    it('should return a promise', function () {
      var promise = noodle.fetch('foo', {});
      assert.equal(true, isPromise(promise));
    });
  });
});

describe('Types', function () {
  describe('html', function () {

  });

  describe('json', function () {

  });

  describe('feed', function () {

  });

  describe('xml', function () {

  });
});

describe('Cache', function () {

  server.close();
});

describe('Query', function () {

});

function isPromise (obj) {
  return !!(obj.promiseSend && obj.valueOf);
}