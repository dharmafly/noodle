var q            = require('q'),
    fs           = require('fs'),
    request      = require('request'),
    Cache        = require('./cache'),
    pageCache,
    resultsCache;


exports.fetch = function (url, query) {
  var deferred = q.defer();

  if (pageCache.check(query)) {
    console.log("from cache");
    deferred.resolve(pageCache.get(query).value);
  } else {
    request(url, function (err, response, body) {
      if (err || response.statusCode != 200) {
        deferred.reject(new Error('Document not found'));
      } else {
        console.log("fresh");
        pageCache.put(query, body);
        deferred.resolve(body);
      }
    });
  }

  return deferred.promise;
};

exports._wrapResults = function (results, query) {
  var resultObject;
  if (results.length > 0) {
    resultObject = resultsCache.put(query, results);
    return {
      results: resultObject.value,
      created: resultObject.created
    }
  }
  return [];
};


// Load config

exports.config = JSON.parse(fs.readFileSync('lib/config.json'));


// Initialize caches

pageCache      = new Cache({
  cacheMaxTime:   exports.config.pageCacheMaxTime,
  cachePurgeTime: exports.config.pageCachePurgeTime,
  cacheMaxSize:   exports.config.pageCacheMaxSize
});

resultsCache   = new Cache({
  cacheMaxTime:   exports.config.resultsCacheMaxTime,
  cachePurgeTime: exports.config.resultsCachePurgeTime,
  cacheMaxSize:   exports.config.resultsCacheMaxSize
});


// Initialize supported document types

fs.readdirSync('lib/types/').forEach(function (file) {
  file          = file.substr(0, file.lastIndexOf('.'));
  exports[file] = require('./types/' + file);
  exports[file]._init(exports);
});