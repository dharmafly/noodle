var q            = require('q'),
    fs           = require('fs'),
    util         = require('util'),
    async        = require('async'),
    request      = require('request'),
    Cache        = require('./cache'),
    pageCache,
    resultsCache;

exports.query = function (queries) {
  var deferred   = q.defer(),
      queries    = util.isArray(queries) ? queries : [queries],
      asyncTasks = [];

  queries.forEach(function (query) {
    asyncTasks.push(function (callback) {
      query.type = query.type || exports.config.defaultDocumentType;

      if (exports[query.type]) {
        exports[query.type].fetch(query.url, query)
          .then(function (result) {
            callback(null, result);
          })
          .fail(function (error) {
            callback(null, {results: [], error: error.message});
          });
      } else {
        callback(null, {results: [], error: 'Document type not supported'});
      }

    });
  });

  // This callback fires when all the aynchronousTask functions 
  // (above) have called back (marked as completed).
  //
  // Async.parallel ensures order.

  async.parallel(asyncTasks, function (err, results) {
    deferred.resolve({results: results});
  });

  return deferred.promise;
};

exports.fetch = function (url, query) {
  var deferred = q.defer();

  if (pageCache.check(query)) {
    console.log("Cached Page");
    deferred.resolve(pageCache.get(query).value.body);
  } else {
    request(url, function (err, response, body) {
      if (err || response.statusCode != 200) {
        deferred.reject(new Error('Document not found'));
      } else {
        console.log("Fresh Page");
        pageCache.put(query, {body: body, headers: response.headers});
        deferred.resolve(body);
      }
    });
  }

  return deferred.promise;
};

// Handles putting results in cache and header parameters

exports._wrapResults = function (results, query) {
  var resultSet = {};

  if (results.length > 0) {
    resultSet.results = results;
    if (query.headers) {
      resultSet.headers = addHeadersToResultSet(query);
    }
    if (query.linkHeader) {
      resultSet.headers = resultSet.headers || {};
      resultSet.headers['link'] = addLinkHeaders(query);
    }

    console.log(resultSet);

    resultSet.created = resultsCache.put(query, resultSet).created;
    return resultSet;
  }

  return [];
};

function addHeadersToResultSet (query) {
  var bucket      = {},
      pageHeaders = pageCache.get(query).value.headers,
      i;

  if (query.headers != 'all' && util.isArray(query.headers)) {
    for (i in pageHeaders) {
      query.headers.forEach(function (name) {
        if (i.toLowerCase() == name.toLowerCase()) {
          bucket[name] = pageHeaders[i];
        }
      });
    }
    return bucket;
  } else {
    return pageHeaders;
  }
}

// http://developer.github.com/v3/#pagination

function addLinkHeaders (query) {
  var header = pageCache.get(query).value.headers.link;

  if (!header) return 'No link header';

  var parts = header.split(','),
      links = {};

  // Parse each part into a named link
  parts.forEach(function(p) {
    var section = p.split(';');
    var url = section[0].replace(/<(.*)>/, '$1').trim();
    var name = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = url;
  });

  return links;
}

// Load config

exports.config = JSON.parse(fs.readFileSync('lib/config.json'));


// Initialize caches and expose the results cache for type modules

pageCache = new Cache({
  cacheMaxTime:   exports.config.pageCacheMaxTime,
  cachePurgeTime: exports.config.pageCachePurgeTime,
  cacheMaxSize:   exports.config.pageCacheMaxSize
});

exports.cache = resultsCache = new Cache({
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