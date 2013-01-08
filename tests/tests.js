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
    it('should return an array', function (done) {
      noodle.query(fixtures.queries.simple)
        .then(function (results) {
          expect(results).to.be.a('array');
          done();
        });
    });
  });

  describe('json', function () {

  });

  describe('feed', function () {

  });

  describe('xml', function () {

  });
});

describe('Cache', function () {

});

describe('Query', function () {
  describe('type: html', function () {
    
  });

  describe('type: json', function () {

  });

  describe('type: feed', function () {

  });

  describe('type: xml', function () {

  });

  describe('map notation', function () {

  });

  describe('post data', function () {

  });

  describe('headers', function () {

  });

  describe('multiple queries', function () {

  });
});

function isPromise (obj) {
  return !!(obj.promiseSend && obj.valueOf);
}