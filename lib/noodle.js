var q            = require('q'),
    fs           = require('fs'),
    events       = require('events'),
    request      = require('request'),
    _            = require('underscore'),
    Cache        = require('./cache'),
    pageCache,
    resultsCache;


// ------------------------------------------------------------
// Main noodle entry point for usage.
// 
// Accepts one or an array of noodle queries. Based on the 
// query type it will make use of the appropriate type module 
// to do the processing.
//
// See docs/ for information on what and noodle queries can 
// be written.
// ------------------------------------------------------------

exports.query = function (queries) {
  var deferred = q.defer(),
      promises = [];

  // Normalise one query to an array

  queries  = _.isArray(queries) ? queries : [queries],

  // For each query route resolve it as either a normal query 
  // or a map query

  queries.forEach(function (query, i) {
    var deferred = q.defer();

    query.type  = query.type || exports.config.defaultDocumentType;
    query.cache = (query.cache === false) ? false : true;

    exports.events.emit('noodle/query', query);

    if (exports[query.type]) {
      if (query.map) {
        handleQueryMap(query, deferred, i);
      } else {
        handleQuery(query, deferred, i);
      }
    } else {
      deferred.resolve({results: [], error: 'Document type not supported'});
    }
    promises.push(deferred.promise);
  });

  // Return master promise when all queries have resolved
  // and ensure that the order they were evaluated is 
  // maintained

  q.all(promises)
    .then(function (results) {
      results = results.sort(function (a, b) {
        return a.orderNo - b.orderNo;
      });

      results.forEach(function (result) {
        delete result.orderNo;
      });

      deferred.resolve({results: results});
    });

  return deferred.promise;
};

function handleQuery (query, deferred, i) {
  exports[query.type].fetch(query.url, query)
    .then(function (result) {
      result.orderNo = i;
      if (query.cache) {
        result.created = resultsCache.get(query).created;
      }
      deferred.resolve(result);
    })
    .fail(function (error) {
      deferred.resolve({results: [], error: error.message, orderNo: i});
    });
}

function handleQueryMap (query, deferred, i) {
  map(query, function (error, result) {
    if (!error) {
      result.orderNo = i;
      if (query.cache) {
        result.created = resultsCache.get(query).created;
      }
      deferred.resolve(result);
    } else {
      deferred.resolve({results: [], error: error.message, orderNo: i});
    }
  });
}

// ------------------------------------------------------------
// Fetch a web document (possibly from cache) with a url.
//
// The query should also be passed in as it contains
// details if it should bypass the cache or if it is a POST
// request.
//
// This fetch method is used by the different type modules to 
// get the document before they do they interpret the query 
// process the document.
// ------------------------------------------------------------

exports.fetch = function (url, query) {
  var deferred       = q.defer(),
      requestOptions = {
        method: 'GET',
        uri: url,
        headers: {'user-agent': exports.config.userAgent}
      };

  if (query.post) {
    requestOptions.method = 'POST';
    requestOptions.body   = serialize(query.post);
    query.cache           = false;
  }

  // (!) This aspect should be revised.
  // Force cache true if the person wants header information
  // since header data is read from cache
  query.cache = (query.headers || query.linkHeader) ? true : query.cache;

  if (pageCache.check(url) && query.cache) {
    deferred.resolve(pageCache.get(url).value.body);
  } else {
    getDocument(query.cache, requestOptions, deferred);
  }

  return deferred.promise;
};

function getDocument (shouldCache, options, deferred) {
  request(options, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      deferred.reject(new Error('Document not found'));
    } else {
      if (shouldCache && !pageCache.check(options.uri)) {
        pageCache.put(options.uri, {body: body, headers: response.headers});
        exports.events.emit('cache/page', pageCache.get(options.uri
                            ));
      }
      deferred.resolve(body);
    }
  });
}

// ------------------------------------------------------------
// Returns an object representing a result set which comprises
// of an array of 1 or more results and the associate page 
// header information.
//
// (!!) This is where a result set is cached in resultsCache.
//
// Exposed as it is also called from some type modules.
// ------------------------------------------------------------

exports._wrapResults = function (results, query) {
  var resultSet = {};

  if (results.length || Object.keys(results).length) {
    resultSet.results = results;

    if (query.headers) {
      resultSet.headers = getHeadersForResultSet(query);
    }

    if (query.linkHeader) {
      resultSet.headers      = resultSet.headers     || {};
      resultSet.headers.link = getLinkHeaders(query) || null;
    }

    if (query.cache) {
      if (resultsCache.check(query) === false) {
        resultsCache.put(query, resultSet);
        exports.events.emit('cache/result', resultsCache.get(query));
      }
    }

    return resultSet;
  }

  return [];
};

// ------------------------------------------------------------
// The namespace for noodles events.
//
// Events are emitted from both this file and cache.js.
//
// One can subscribe to the following events:
// - cache/page
// - cache/result
// - cache/purge
// - cache/expire
//
// ------------------------------------------------------------

exports.events = new events.EventEmitter();

// ------------------------------------------------------------
// An exposed noodle config initialized by an editable 
// json representation at lib/config.json
// ------------------------------------------------------------

exports.config = JSON.parse(fs.readFileSync(__dirname +'/config.json'));

// ------------------------------------------------------------
// Accepts a full or part config object an extends it over
// the existing noodle config.
//
// This is a way to programmatically configure the config 
// without touching lib/config.json
// ------------------------------------------------------------

exports.configure = function (obj) {
  exports.config = _.extend(exports.config, obj);
};

// ------------------------------------------------------------
// Stops the cache intervals from running in the event loop.
// Allows for the node process to exit.
// ------------------------------------------------------------

exports.stopCache = function () {
  resultsCache.stop();
  pageCache.stop();
};

// Function called from exports.query()
//
// Takes in a query in the map notation
//
// For each map property, a call to the appropriate type module
// is done and the result is grabbed for that map property's
// value.
//
// When all properties are mapped with values this function calls
// back to exports.query().

function map (query, callback) {
  var promises        = [],
      mappedContainer = {},
      getResultSet,
      toPush,
      mapTo;

  getResultSet = function (mapTo, query) {
    query.map[mapTo].url   = query.url;
    query.map[mapTo].cache = query.cache;

    return exports[query.type].fetch(query.url, query.map[mapTo])
            .then(function (result) {
              mappedContainer[mapTo] = result.results;
            })
            .fail(function (error) {
              mappedContainer[mapTo] = {results: [], error: error.message};
            });
  };

  for (mapTo in query.map) {
    promises.push(getResultSet(mapTo, query));
  }

  q.all(promises)
    .then(function () {
      callback(null, exports._wrapResults(mappedContainer, query));
    })
    .fail(function (error) {
      callback(error);
    });
}

// Function called from exports._wrapResults()
//
// Passed in a query and returns the full page headers 
// or specific page headers as specified by the query.

function getHeadersForResultSet (query) {
  var bucket      = {},
      pageHeaders = pageCache.get(query.url).value.headers,
      prop;

  if (query.headers !== 'all' && _.isArray(query.headers)) {
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

// Function called from exports._wrapResults()
//
// Passed in a query this function returns a parsed representation
// of the Link header values (intended to aid people with navigation).

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

// Function called from exports.query
//
// Will return a query parameter string from an object.

function serialize (obj) {
  var str = [], p;
  for (p in obj) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  }
  return str.join("&");
}

// .---------------------------.
// |noodle initialization stuff|
// '---------------------------'

// Initialize supported document types

fs.readdirSync(__dirname + '/types/').forEach(function (file) {
  file = file.substr(0, file.lastIndexOf('.'));
  exports[file] = require('./types/' + file);
  exports[file]._init(exports);
});

// Start the logger.
// The logger will output to terminal if config.debug is set 
// to true.

require('./logger')(exports);

// Initialize caches

// ------------------------------------------------------------
// The results cache is exposed for different type modules
// so they can cache their results.
// ------------------------------------------------------------

exports.cache = resultsCache = new Cache({
  cacheMaxTime:   exports.config.resultsCacheMaxTime,
  cachePurgeTime: exports.config.resultsCachePurgeTime,
  cacheMaxSize:   exports.config.resultsCacheMaxSize
}, exports);

pageCache = new Cache({
  cacheMaxTime:   exports.config.pageCacheMaxTime,
  cachePurgeTime: exports.config.pageCachePurgeTime,
  cacheMaxSize:   exports.config.pageCacheMaxSize
}, exports);

resultsCache.start();
pageCache.start();
