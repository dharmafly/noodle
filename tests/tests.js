var assert = require("assert"),
    noodle = require('../lib/noodle'),
    cache  = require('../lib/cache'),
    html   = require('../lib/types/html'),
    json   = require('../lib/types/json'),
    feed   = require('../lib/types/feed'),
    xml    = require('../lib/types/xml');

describe('noodle', function () {
  describe('query()', function () {
    it('should return a promise', function () {
      var promise   = noodle.query({url: 'foo'}),
          isPromise = !!(promise.promiseSend && promise.valueOf);

      assert.equal(true, isPromise);
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

});