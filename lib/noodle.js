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
      asyncTasks;

  asyncTasks = queries.map(function (query) {
    return function (callback) {
      query.type  = query.type || exports.config.defaultDocumentType;
      query.cache = (query.cache === false) ? false : true;

      if (exports[query.type]) {
        if (query.map) {
          map(query, function (error, result) {
            if (!error) {
              result.created = pageCache.get(query.url).created;
              callback(null, result);
            } else {
              callback(null, {results: {}, error: error.message});
            }
          });
        } else {
          exports[query.type].fetch(query.url, query)
            .then(function (result) {
              result.created = pageCache.get(query.url).created;
              callback(null, result);
            })
            .fail(function (error) {
              callback(null, {results: [], error: error.message});
            });
        }
      } else {
        callback(null, {results: [], error: 'Document type not supported'});
      }
    }
  });

  // This callback fires when all the aynchronousTask functions 
  // (above) have called back (marked as completed).
  //
  // Async.parallel ensures order.

  async.parallel(asyncTasks, function (error, results) {
    deferred.resolve({results: results});
  });

  return deferred.promise;
};

exports.fetch = function (url, query) {
  var deferred       = q.defer(),
      requestOptions = {
        method: 'GET',
        uri: url,
        headers: {'user-agent': exports.config.userAgent}
      };

  if (pageCache.check(url) && query.cache) {
    deferred.resolve(pageCache.get(url).value.body);
  } else {

    if (query.post) {
      requestOptions.method = 'POST';
      requestOptions.body   = serialize(query.post);
    }

    request(requestOptions, function (err, response, body) {
      if (err || response.statusCode != 200) {
        console.log("Document not found: ", url);
        deferred.reject(new Error('Document not found'));
      } else {
        console.log("Fresh Page");
        console.log(query);
        if (query.cache) {
          pageCache.put(url, {body: body, headers: response.headers});
        }
        deferred.resolve(body);
      }
    });
  }

  return deferred.promise;
};

// Handles putting results in cache and header parameters

exports._wrapResults = function (results, query) {
  var resultSet = {};

  if (results.length > 0 || Object.keys(results).length > 0) {
    resultSet.results = results;

    if (query.headers) {
      resultSet.headers = addHeadersToResultSet(query);
    }

    if (query.linkHeader) {
      resultSet.headers = resultSet.headers || {};
      resultSet.headers['link'] = getLinkHeaders(query) || null;
    }

    if (query.cache) {
      resultsCache.put(query, resultSet).created;
    } 

    return resultSet;
  }

  return [];
};

function map (query, callback) {
  var promises        = [],
      mappedContainer = {},
      toPush,
      mapTo;

  for (mapTo in query.map) {
    function getResultSet (mapTo) {
      query.map[mapTo].url = query.url;
      query.map[mapTo].cache = query.cache;

      return exports[query.type].fetch(query.url, query.map[mapTo])
              .then(function (result) {
                mappedContainer[mapTo] = result.results;
              })
              .fail(function (error) {
                mappedContainer[mapTo] = {results: [], error: error.message};
              });
    }
    promises.push(getResultSet(mapTo));
  }

  q.all(promises)
    .then(function () {
      callback(null, exports._wrapResults(mappedContainer, query));
    })
    .fail(function (error) {
      callback(error);
    });
}

function addHeadersToResultSet (query) {
  var bucket      = {},
      pageHeaders = pageCache.get(query.url).value.headers,
      prop;

  if (query.headers !== 'all' && util.isArray(query.headers)) {
    for (prop in pageHeaders) {
      query.headers.forEach(function (name) {
        if (prop.toLowerCase() === name.toLowerCase()) {
          bucket[name] = pageHeaders[prop];
        }
      });
    }
    return bucket;
  } else {
    return pageHeaders;
  }
}

function getLinkHeaders (query) {
  var header = pageCache.get(query.url).value.headers.link,
      links  = {},
      parts;

  if (header) {
    parts = header.split(',');
  } else {
    return false;
  }

  // Parse each part into a named link
  parts.forEach(function(p) {
    var section = p.split(';'),
        url     = section[0].replace(/<(.*)>/, '$1').trim(),
        name    = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = url;
  });

  return links;
}

function serialize (obj) {
  var str = [], p;
  for(p in obj)
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
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
  file = file.substr(0, file.lastIndexOf('.'));
  exports[file] = require('./types/' + file);
  exports[file]._init(exports);
});