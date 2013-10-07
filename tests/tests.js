var assert    = require('assert'),
    _         = require('underscore'),
    fixtures  = require('./fixtures'),
    noodle    = require('../lib/noodle'),
    cache     = require('../lib/cache'),
    html      = require('../lib/types/html'),
    json      = require('../lib/types/json'),
    feed      = require('../lib/types/feed'),
    xml       = require('../lib/types/xml'),
    stringify = JSON.stringify;

noodle.configure({
  "debug": false
});

Array.prototype.AllValuesSame = function(){
  if(this.length > 0) {
    for(var i = 1; i < this.length; i++) {
      if(this[i] !== this[0]) {
        return false;
      }
    }
  } 
  return true;
};

function isPromise (obj) {
  return !!obj.promiseSend;
}

// Noodle library

describe('Noodle', function () {
  describe('noodle.query', function () {
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
    it('its promise should resolve to an object containing results', function (done) {
      noodle.query(fixtures.queries.html.simple)
        .then(function (results) {
          if (_.isArray(results.results)) {
            done();
          } else {
            done(new Error('results.results was not an array'));
          }
        });
    });
  });

  describe('noodle.json', function () {
    it('promise should resolve to an array', function (done) {
      noodle.query(fixtures.queries.json.simple)
        .then(function (results) {
          if (_.isArray(results.results)) {
            done();
          } else {
            done(new Error('results.results was not an array'));
          }
        });
    });
  });

  describe('noodle.feed', function () {
    it('promise should resolve to an array', function (done) {
      noodle.query(fixtures.queries.feed.simple)
        .then(function (results) {
          if (_.isArray(results.results)) {
            done();
          } else {
            done(new Error('results.results was not an array'));
          }
        });
    });
  });

  describe('noodle.xml', function () {
    it('promise should resolve to an array', function (done) {
      noodle.query(fixtures.queries.xml.simple)
        .then(function (results) {
          if (_.isArray(results.results)) {
            done();
          } else {
            done(new Error('results.results was not an array'));
          }
        });
    });
  });
});


// Noodle's cache

describe('cache', function () {

});


// Noodle query api

describe('Noodle object query API', function () {
  var allArrays = [];

  describe('type: html', function () {
    it('should have accurate result data', function (done) {
      noodle.query(fixtures.queries.html.simple)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results, fixtures.queries.answers.html.simple)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    it('should still return full document if no selector is specified', function (done) {
      noodle.query(fixtures.queries.html.noSelector)
        .then(function (results) {
          var expectedHTMLDoc = results.results[0].results;
          allArrays.push(_.isArray(results.results));
          if (typeof expectedHTMLDoc === 'string' && expectedHTMLDoc.length > 1000) {
            done();
          } else {
            done(new Error('Results did not contain full document'));
          }
        });
    });

    it('should still return some data if no extract is specified', function (done) {
      noodle.query(fixtures.queries.html.noExtract)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results, fixtures.queries.answers.html.noExtract)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    it('should still return some data if no type is specified', function (done) {
      noodle.query(fixtures.queries.html.noType)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results, fixtures.queries.answers.html.noType)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    describe('errors', function () {
      it('should report on a poor selector', function (done) {
        noodle.query(fixtures.queries.html.badSelector)
          .then(function (results) {
            allArrays.push(_.isArray(results.results));
            if (_.isEqual(results.results, fixtures.queries.answers.html.badSelector)) {
              done();
            } else {
              done(new Error('Results and fixtures do not match up.'));
            }
          });
      });

      it('should default to selecting text if no extract is supplied', function (done){
        noodle.query(fixtures.queries.html.noExtract)
          .then(function (results) {
            allArrays.push(_.isArray(results.results));
            if (_.isEqual(results.results, fixtures.queries.answers.html.noExtract)) {
              done();
            } else {
              done(new Error('Results and fixtures do not match up.'));
            }
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

    it('should have result data', function (done) {
      noodle.query(fixtures.queries.json.simple)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results, fixtures.queries.answers.json.simple)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    it('should still return some data if no selector is specified', function (done) {
      noodle.query(fixtures.queries.json.noSelector)
        .then(function (results) {
          var expectedJSONDoc = results.results[0].results;
          allArrays.push(_.isArray(results.results));
          if (typeof expectedJSONDoc === 'object') {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    it('should still return some data if no type is specified', function (done) {
      noodle.query(fixtures.queries.json.noType)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results, fixtures.queries.answers.json.noType)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    describe('errors', function () {
      it('should report on a poor selector', function (done) {
        noodle.query(fixtures.queries.json.badSelector)
          .then(function (results) {
            allArrays.push(_.isArray(results.results));
            if (_.isEqual(results.results, fixtures.queries.answers.json.badSelector)) {
              done();
            } else {
              done(new Error('Results and fixtures do not match up.'));
            }
          });
      });
      
      it('should report on a parse error', function (done) {
        noodle.query(fixtures.queries.json.badParse)
          .then(function (results) {
            allArrays.push(_.isArray(results.results));
            if (_.isEqual(results.results, fixtures.queries.answers.json.badParse)) {
              done();
            } else {
              done(new Error('Results and fixtures do not match up.'));
            }
          });
      });
    });
  });

  describe('type: feed', function () {
    before(function () {
      noodle.configure({
        defaultDocumentType: 'feed'
      });
    });

    it('should have result data', function (done) {
      noodle.query(fixtures.queries.feed.simple)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results) === _.isEqual(fixtures.queries.answers.feed.simple)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    it('should still return some data if no selector is specified', function (done) {
      noodle.query(fixtures.queries.feed.noSelector)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (stringify(results.results) === stringify(fixtures.queries.answers.feed.noSelector)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    it('should still return some data if no type is specified', function (done) {
      noodle.query(fixtures.queries.feed.noType)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results, fixtures.queries.answers.feed.noType)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    describe('errors', function () {
      it('should report on a poor selector', function (done) {
        noodle.query(fixtures.queries.feed.badSelector)
          .then(function (results) {
            allArrays.push(_.isArray(results.results));
            if (_.isEqual(results.results, fixtures.queries.answers.feed.badSelector)) {
              done();
            } else {
              done(new Error('Results and fixtures do not match up.'));
            }
          });
      });
      
      it('should report on a parse error', function (done) {
        noodle.query(fixtures.queries.feed.badParse)
          .then(function (results) {
            allArrays.push(_.isArray(results.results));
            if (_.isEqual(results.results, fixtures.queries.answers.feed.badParse)) {
              done();
            } else {
              done(new Error('Results and fixtures do not match up.'));
            }
          });
        });
    });
  });

  describe('type: xml', function () {
    before(function () {
      noodle.configure({
        defaultDocumentType: 'xml'
      });
    });

    it('should have result data', function (done) {
      noodle.query(fixtures.queries.xml.simple)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results, fixtures.queries.answers.xml.simple)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    it('should still return some data if no selector is specified', function (done) {
      noodle.query(fixtures.queries.xml.noSelector)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results, fixtures.queries.answers.xml.noSelector)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    it('should still return some data if no type is specified', function (done) {
      noodle.query(fixtures.queries.xml.noType)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results, fixtures.queries.answers.xml.noType)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    describe('errors', function () {
      it('should report on a poor selector', function (done) {
        noodle.query(fixtures.queries.xml.badSelector)
          .then(function (results) {
            allArrays.push(_.isArray(results.results));
            if (_.isEqual(results.results, fixtures.queries.answers.xml.badSelector)) {
              done();
            } else {
              done(new Error('Results and fixtures do not match up.'));
            }
          });
      });
      
      it('should report on a parse error', function (done) {
        noodle.query(fixtures.queries.xml.badParse)
          .then(function (results) {
            allArrays.push(_.isArray(results.results));
            if (_.isEqual(results.results, fixtures.queries.answers.xml.badParse)) {
              done();
            } else {
              done(new Error('Results and fixtures do not match up.'));
            }
          });
      });
    });
  });

describe('generic query error messages', function () {
  it('errors if no url is specified', function (done) {
    noodle.query(fixtures.queries.misc.badUrl)
      .then(function (results) {
        if (_.isEqual(results.results, fixtures.queries.answers.misc.badUrl)) {
          done();
        } else {
          done(new Error('Results and fixtures do not match up.'));
        }
      });
  });

  it('errors if a non-supported type is specified', function (done) {
    noodle.query(fixtures.queries.misc.badType)
      .then(function (results) {
        if (_.isEqual(results.results, fixtures.queries.answers.misc.badType)) {
          done();
        } else {
          done(new Error('Results and fixtures do not match up.'));
        }
      });
  });
});

  describe('map notation', function () {
    it('result should contain properties as specified in the map as well as data', function (done) {
      noodle.query(fixtures.queries.map.simple)
        .then(function (results) {
          allArrays.push(_.isArray(results.results));
          if (_.isEqual(results.results, fixtures.queries.answers.map.simple)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });
  });

  describe('post data', function () {
    it('should return data from post requests', function (done) {
      noodle.query(fixtures.queries.post.simple)
      .then(function (results) {
        if (_.isEqual(results.results, fixtures.queries.answers.post.simple)) {
          done();
        } else {
          done(new Error('Results and fixtures do not match up.'));
        }
      });
    });
  });

  describe('headers', function () {
    it('should parse headers', function (done) {
      noodle.query(fixtures.queries.headers.simple)
        .then(function (results) {
          var fix = fixtures.queries.answers.headers.simple[0];
          if (_.isEqual(results.results[0].results, fix.results) &&
            _.isEqual(results.results[0].headers, fix.headers)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });

    it('should parse link headers', function (done) {
      noodle.query(fixtures.queries.headers.linkHeaders)
        .then(function (results) {
          var fix = fixtures.queries.answers.headers.linkHeaders[0];
          if (_.isEqual(results.results[0].results, fix.results) &&
            _.isEqual(results.results[0].headers, fix.headers)) {
            done();
          } else {
            done(new Error('Results and fixtures do not match up.'));
          }
        });
    });
  });

  describe('multiple queries', function () {
    it('(A) the returned order should match the order of the sent query', function (done) {
      var queries = [
        fixtures.queries.html.simple,
        fixtures.queries.json.simple,
        fixtures.queries.feed.simple,
        fixtures.queries.xml.simple
      ];
      noodle.query(queries)
        .then(function (results) {
          var match1 = _.isEqual(results.results[0], fixtures.queries.answers.html.simple[0]),
              match2 = _.isEqual(results.results[1], fixtures.queries.answers.json.simple[0]),
              match3 = _.isEqual(results.results[2], fixtures.queries.answers.feed.simple[0]),
              match4 = _.isEqual(results.results[3], fixtures.queries.answers.xml.simple[0]);
          if (match1 && match2 && match3 && match4) {
            done();
          } else {
            done(new Error('Order was not maintained or results/fixtures mismatch'));
          }
        });
    });
    it('(B) the returned order should match the order of the sent query', function (done) {
      var queries = [
        fixtures.queries.json.simple,
        fixtures.queries.html.simple,
        fixtures.queries.xml.simple,
        fixtures.queries.feed.simple
      ];
      noodle.query(queries)
        .then(function (results) {
          var match1 = _.isEqual(results.results[1], fixtures.queries.answers.html.simple[0]),
              match2 = _.isEqual(results.results[0], fixtures.queries.answers.json.simple[0]),
              match3 = _.isEqual(results.results[3], fixtures.queries.answers.feed.simple[0]),
              match4 = _.isEqual(results.results[2], fixtures.queries.answers.xml.simple[0]);
          if (match1 && match2 && match3 && match4) {
            done();
          } else {
            done(new Error('Order was not maintained or results/fixtures mismatch'));
          }
        });
    });
    it('(C) the returned order should match the order of the sent query', function (done) {
      var queries = [
        fixtures.queries.html.simple,
        fixtures.queries.json.simple,
        fixtures.queries.feed.simple,
        fixtures.queries.xml.simple
      ];
      noodle.query(queries)
        .then(function (results) {
          var match1 = _.isEqual(results.results[0], fixtures.queries.answers.html.simple[0]),
              match2 = _.isEqual(results.results[1], fixtures.queries.answers.json.simple[0]),
              match3 = _.isEqual(results.results[2], fixtures.queries.answers.feed.simple[0]),
              match4 = _.isEqual(results.results[3], fixtures.queries.answers.xml.simple[0]);
          if (match1 && match2 && match3 && match4) {
            done();
          } else {
            done(new Error('Order was not maintained or results/fixtures mismatch'));
          }
        });
    });
  });

  describe('consistent response format', function () {
    it('should return all responses as arrays', function () {
      assert.equal(true, allArrays.indexOf(false) === -1);
    });

    it('should always return the "created" property from cache', function (done) {
      noodle.query(fixtures.queries.html.withCache)
        .then(function (results) {
          if (results.results[0].created) {
            done();
          } else {
            done(new Error('"created" property wasn\'t included with cached response.'));
          }
        });
    });
  });
});