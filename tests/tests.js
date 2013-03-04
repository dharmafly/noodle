var util     = require('util'),
    assert   = require('assert'),
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
  "pageCacheMaxSize":      60480000,
  "debug":                 false
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
    it('promise should resolve an array', function (done) {
      noodle.query(fixtures.queries.html.simple)
        .then(function (results) {
          done();
          expect(results).to.be.an('array');
        });
    });
  });

  describe('noodle.json', function () {
    it('promise should resolve an array', function (done) {
      noodle.query(fixtures.queries.json.simple)
        .then(function (results) {
          done();
          expect(results).to.be.an('array');
        });
    });
  });

  describe('noodle.feed', function () {
    it('promise should resolve an array', function (done) {
      noodle.query(fixtures.queries.feed.simple)
        .then(function (results) {
          done();
          expect(results).to.be.an('array');
        });
    });
  });

  describe('noodle.xml', function () {
    it('promise should resolve an array', function (done) {
      noodle.query(fixtures.queries.xml.simple)
        .then(function (results) {
          done();
          expect(results).to.be.an('array');
        });
    });
  });
});

// Tests regarding noodle's cache module

describe('Cache', function () {

});

// Tests regarding the noodle queries

describe('Query responses', function () {
  var allObjects = [];

  describe('type: html', function () {
    it('should have result data', function (done) {
      noodle.query(fixtures.queries.html.simple)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.html.simple);
        });
    });

    it('should still return full document if no selector is specified', function () {
      noodle.query(fixtures.queries.html.noSelector)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results[0].results).to.be.a('string');
        });
    });

    it('should still return some data if no extract is specified', function () {
      noodle.query(fixtures.queries.html.noExtract)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.html.noExtract);
        });
    });

    it('should still return some data if no type is specified', function () {
      noodle.query(fixtures.queries.html.noType)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.html.noType);
        });
    });

    describe('errors', function () {
      it('should report on a poor selector', function () {
        noodle.query(fixtures.queries.html.badSelector)
          .then(function (results) {
            allObjects.push(util.isArray(results));
            done();
            expect(results).to.eql(fixtures.queries.answers.html.badSelector);
          });
      });

      it('should default to selecting html if no extract is supplied', function (){
        noodle.query(fixtures.queries.html.badExtract)
          .then(function (results) {
            allObjects.push(util.isArray(results));
            done();
            expect(results).to.eql(fixtures.queries.answers.html.badExtract);
          });
      });
    });
  });

  describe('type: json', function () {
    before(function () {
      noodle.configure({
        defaultDocumentType: 'json'
      });
    });

    it('should have result data', function () {
      noodle.query(fixtures.queries.json.simple)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.json.simple);
        });
    });

    it('should still return some data if no selector is specified', function () {
      noodle.query(fixtures.queries.json.noSelector)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.json.noSelector);
        });
    });

    it('should still return some data if no type is specified', function () {
      noodle.query(fixtures.queries.json.noType)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.json.noType);
        });
    });

    describe('errors', function () {
      it('should report on a poor selector', function () {
        noodle.query(fixtures.queries.json.badSelector)
          .then(function (results) {
            allObjects.push(util.isArray(results));
            done();
            expect(results).to.eql(fixtures.queries.answers.json.badSelector);
          });
      });
      
      it('should report on a parse error', function () {
        noodle.query(fixtures.queries.json.badParse)
          .then(function (results) {
            allObjects.push(util.isArray(results));
            done();
            expect(results).to.eql(fixtures.queries.answers.json.badParse);
          });
      });
    });
  });

  describe('type: feed', function () {
    it('should have result data', function () {
      noodle.query(fixtures.queries.feed.simple)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.feed.simple);
        });
    });

    it('should still return some data if no selector is specified', function () {
      noodle.query(fixtures.queries.feed.noSelector)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.feed.noSelector);
        });
    });

    it('should still return some data if no type is specified', function () {
      noodle.query(fixtures.queries.feed.noType)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.feed.noType);
        });
    });

    describe('errors', function () {
      it('should report on a poor selector', function () {
        noodle.query(fixtures.queries.feed.badSelector)
          .then(function (results) {
            allObjects.push(util.isArray(results));
            done();
            expect(results).to.eql(fixtures.queries.answers.feed.badSelector);
          });
      });
      
      it('should report on a parse error', function () {
        noodle.query(fixtures.queries.feed.badParse)
          .then(function (results) {
            allObjects.push(util.isArray(results));
            done();
            expect(results).to.eql(fixtures.queries.answers.feed.badParse);
          });
        });
    });
  });

  describe('type: xml', function () {
    it('should have result data', function () {
      noodle.query(fixtures.queries.xml.simple)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.xml.simple);
        });
    });

    it('should still return some data if no selector is specified', function () {
      noodle.query(fixtures.queries.xml.noSelector)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.xml.noSelector);
        });
    });

    it('should still return some data if no type is specified', function () {
      noodle.query(fixtures.queries.xml.noType)
        .then(function (results) {
          allObjects.push(util.isArray(results));
          done();
          expect(results).to.eql(fixtures.queries.answers.xml.noType);
        });
    });

    describe('errors', function () {
      it('should report on a poor selector', function () {
        noodle.query(fixtures.queries.xml.badSelector)
          .then(function (results) {
            allObjects.push(util.isArray(results));
            done();
            expect(results).to.eql(fixtures.queries.answers.xml.badSelector);
          });
      });
      
      it('should report on a parse error', function () {
        noodle.query(fixtures.queries.xml.badParse)
          .then(function (results) {
            allObjects.push(util.isArray(results));
            done();
            expect(results).to.eql(fixtures.queries.answers.xml.badParse);
          });
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
    it('should return all responses not as arrays but single objects', function () {
      
      expect(allObjects.AllValuesSame()).to.eql(true);
    });
  });
});



function isPromise (obj) {
  return !!(obj.promiseSend && obj.valueOf);
}

Array.prototype.AllValuesSame = function(){

    if(this.length > 0) {
        for(var i = 1; i < this.length; i++)
        {
            if(this[i] !== this[0])
                return false;
        }
    } 
    return true;
}