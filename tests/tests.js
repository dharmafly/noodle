var assert   = require('assert'),
    expect   = require('chai').expect,
    fixtures = require('./fixtures'),
    noodle   = require('../lib/noodle'),
    cache    = require('../lib/cache'),
    html     = require('../lib/types/html'),
    json     = require('../lib/types/json'),
    feed     = require('../lib/types/feed'),
    xml      = require('../lib/types/xml');

noodle.configure({
  "resultsCacheMaxTime":   60480000,
  "resultsCachePurgeTime": 60480000,
  "resultsCacheMaxSize":   60480000,
  "pageCacheMaxTime":      60480000,
  "pageCachePurgeTime":    60480000,
  "pageCacheMaxSize":      60480000
});

// Tests regarding the noodle library

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

// Tests regarding the noodle library's type modules

describe('Types', function () {
  describe('noodle.html', function () {
    it('should return an array', function (done) {
      noodle.query(fixtures.queries.html.simple)
        .then(function (results) {
          done();
          expect(results).to.be.an('array');
        });
    });
  });

  describe('noodle.json', function () {

  });

  describe('noodle.feed', function () {

  });

  describe('noodle.xml', function () {

  });
});

// Tests regarding noodle's cache module

describe('Cache', function () {

});

// Tests regarding the noodle queries

describe('Query responses', function () {
  var asArrays = [];

  describe('type: html', function () {
    it('should have result data', function () {

    });

    it('should still return some data if no selector is specified', function () {

    });

    it('should still return some data if no extract is specified', function () {

    });

    it('should still return some data if no type is specified', function () {

    });

    describe('errors', function () {
      it('should report on a poor selector', function () {

      });
    });
  });

  describe('type: json', function () {
    it('should have result data', function () {

    });

    it('should still return some data if no selector is specified', function () {

    });

    it('should still return some data if no type is specified', function () {

    });

    describe('errors', function () {
      it('should report on a poor selector', function () {

      });
      
      it('should report on a parse error', function () {

      });
    });
  });

  describe('type: feed', function () {
    it('should have result data', function () {

    });

    it('should still return some data if no selector is specified', function () {

    });

    it('should still return some data if no type is specified', function () {

    });

    describe('errors', function () {
      it('should report on a poor selector', function () {

      });
      
      it('should report on a parse error', function () {

      });
    });
  });

  describe('type: xml', function () {
    it('should have result data', function () {

    });

    it('should still return some data if no selector is specified', function () {

    });

    it('should still return some data if no type is specified', function () {

    });

    describe('errors', function () {
      it('should report on a poor selector', function () {

      });
      
      it('should report on a parse error', function () {

      });
    });
  });

  describe('map notation', function () {
    it('result should contain properties as specified in the map', function () {

    });
  });

  describe('post data', function () {
    it('should return data from post requests', function () {

    });
  });

  describe('headers', function () {
    it('should parse headers', function () {

    });

    it('should parse link headers', function () {

    });
  });

  describe('multiple queries', function () {

  });

  describe('consistent response format', function () {
    it('should return all responses as arrays', function () {
      expect(asArrays.indexOf(false)).to.eql(-1);
    });
  });
});



function isPromise (obj) {
  return !!(obj.promiseSend && obj.valueOf);
}