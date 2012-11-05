var q       = require('q'),
    fs      = require('fs'),
    request = require('request'),
    cache   = require('./cache');

exports.fetch = function (url, query) {
  var deferred = q.defer();

  if (cache.check(query)) {
    deferred.resolve(cache.get(query).results);
    console.log("from cache");
  } else {
    request(url, function (err, response, body) {
      if (err || response.statusCode != 200) {
        deferred.reject('Page not found');
      } else {
        cache.put(query, body);
        console.log("fresh");
        deferred.resolve(body);
      }
    });
  }

  return deferred.promise;
};

exports._wrapResults = function (results, query) {
  if (results.length > 0) {
    return cache.put(query, results);
  }
  return [];
};

// Initialize config settings

exports.config = {
  cacheMaxTime:        60 * 60 * 1000,
  cachePurgeTime:      ((60 * 60 * 1000) * 24) * 7,
  cacheMaxSize:        124,
  defaultDocumentType: 'html'
};


// Initialize supported document types

fs.readdirSync('lib/types/').forEach(function (file) {
  file          = file.substr(0, file.lastIndexOf('.'));
  exports[file] = require('./types/' + file);
  exports[file]._init(exports);
});


// Initialize the cache

cache.start();