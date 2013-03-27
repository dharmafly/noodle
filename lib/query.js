var q            = require('q'),
    fs           = require('fs'),
    events       = require('events'),
    request      = require('request'),
    Cache        = require('./cache'),
    _            = require('underscore'),
    config       = JSON.parse(fs.readFileSync('lib/config.json')),
    typeHandlers = {},
    resultsCache,
    pageCache;

  // ------------------------------------------------------------
  // ActiveQuery represents one query being run; a web document 
  // being fetced and instructions selected against it.
  //
  // Returns a q promise.
  //
  // Arguments
  // - query : A noodle query object.
  // - i     : a property which is attached to the ActiveQuery's 
  //           orderNo property. Useful for maintaining an order 
  //           later after asynchronous operations occured.
  // 
  // Usage
  //
  // new ActiveQuery(query, i).then(function (results) { ... });
  //
  // ------------------------------------------------------------

exports.ActiveQuery = function ActiveQuery (query, i) {
  this.url        = query.url        || this.url;
  this.type       = query.type       || this.type;
  this.selector   = query.selector   || this.selector;
  this.each       = query.each       || this.each;
  this.map        = query.map        || this.map;
  this.cache      = query.cache      || this.cache;
  this.post       = query.post       || this.post;
  this.headers    = query.headers    || this.headers;
  this.linkHeader = query.linkHeader || this.linkHeader;
  this.query      = query            || this.query;
  this.orderNo    = i                || this.orderNo;

  exports.events.emit('noodle/query', query);
};

// Since Q then callbacks fire in a different context
// This function serves to wrap that callback in a 
// familiar context. Example usage just above.

function asContext (ctx, fn) {
  return function () {
    return fn.apply(ctx || {}, arguments);
  }
}

exports.ActiveQuery.prototype = {
  // Active query properties

  query:          null,
  url:            null,
  type:           config.defaultDocumentType,
  userAgent:      config.userAgent,
  selector:       null,
  each:           null,
  map:            null,
  cache:          true,
  post:           false,
  headers:        [],
  linkHeader:     false,

  // Active query state variables

  orderNo:        0,
  results:        null,
  hasPage:        false,
  fetchedPage:    null,
  fetchedHeaders: null,
  requestOptions: {
    uri:     null,
    method:  'GET',
    headers: {'user-agent': this.userAgent}
  },

  // ------------------------------------------------------------
  // Start the query. Returns a promise when fulfilled passes
  // back the fetched and queries results.
  // ------------------------------------------------------------

  promiseResults: function () {
    return this.fetch()
        .then(asContext(this, this.select))
        .then(asContext(this, this._cacheResults))
        .then(asContext(this, this._applyHeaders))
        .then(asContext(this, function (results) {
          results.orderNo = this.orderNo;
          return results;
        }));
  },

  // ------------------------------------------------------------
  // Uses a type handler (html, json, xml etc) to select from 
  // the web document or get cached results
  // ------------------------------------------------------------

  select: function () {
    if (resultsCache.check(this.query)) {
      return this.results = resultsCache.get(this.query).value;
    } else {
      return typeHandlers[this.type].select(this);
    }
  },

  // ------------------------------------------------------------
  // Fetch a web document (possibly from cache) with a url.
  // ------------------------------------------------------------

  fetch: function () {
    var deferred = q.defer();
    
    if (this.url) {
      this.hasPage = pageCache.check(this.url);

      if (this.post) {
        this.requestOptions.method = 'POST';
        this.requestOptions.body   = this._serialize(this.post);
        this.cache                 = false;
      }

      if (this.hasPage && this.cache) {
        deferred.resolve(pageCache.get(this.url).value.body);
      } else {
        this._getDocument(function (docOrErr) {
          deferred.resolve(docOrErr);
        });
      }
    } else {
      deferred.resolve(new Error('No url specified'));
    }

    return deferred.promise;
  },

  _serialize: function (obj) {
    var str = [], p;
    for (p in obj) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
  },

  _getDocument: function (fn) {
    var activeQuery         = this;
    this.requestOptions.uri = this.url;
    request(this.requestOptions, function (err, response, body) {
      if (err || response.statusCode !== 200) {
        fn(new Error('Document not found'));
      } else {
        activeQuery.fetchedPage    = body;
        activeQuery.fetchedHeaders = response.headers;
        if (activeQuery.cache && !activeQuery.hasPage) {
          activeQuery._cachePage();
        }
        fn(body);
      }
    });
  },

  _applyHeaders: function () {
    if (this.headers.length) {
      this.results.headers = this._getHeadersForResult();
    }

    if (this.linkHeader) {
      this.results.headers      = this.results.headers  || {};
      this.results.headers.link = this._getlinkHeader() || null;
    }

    return this.results;
  },

  _getHeadersForResult: function () {
    var headers, prop;

    if (this.query.headers === 'all') {
      return this.fetchedHeaders;
    }
    else if (_.isArray(this.query.headers)) {
      headers = {};
      for (prop in this.fetchedHeaders) {
        this.query.headers.forEach(function (name) {
          if (prop.toLowerCase() === name.toLowerCase()) {
            headers[name] = this.fetchedHeaders[prop];
          }
        });
      }
      return headers;
    }
  },

  _cachePage: function (body, headers) {
    pageCache.put(this.url, {
      body:    this.fetchedPage,
      headers: this.fetchedHeaders
    });
    exports.events.emit('cache/page', pageCache.get(this.url));
  },

  _cacheResults: function (results) {
    var cached = resultsCache.put(this.query, results);
    exports.events.emit('cache/results', cached);
    return this.results = {
      results: cached.value,
      created: cached.created
    };
  }
};

// ------------------------------------------------------------
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
// Stops the cache intervals from running in the event loop.
// Allows for the node process to exit.
// ------------------------------------------------------------

exports.stopCache = function () {
  resultsCache.stop();
  pageCache.stop();
};

// ------------------------------------------------------------
// Start the logger.
//
// The logger will output to terminal if config.debug is set 
// to true.
// ------------------------------------------------------------


require('./logger')(exports.events, config);


// ------------------------------------------------------------
// Put the document type selector handlers in memory
// ------------------------------------------------------------


fs.readdirSync('lib/types/').forEach(function (file) {
  file = file.substr(0, file.lastIndexOf('.'));
  typeHandlers[file] = require('./types/' + file);
});


// ------------------------------------------------------------
// Initialize cache based on config
// ------------------------------------------------------------


resultsCache = new Cache({
  cacheMaxTime:   config.resultsCacheMaxTime,
  cachePurgeTime: config.resultsCachePurgeTime,
  cacheMaxSize:   config.resultsCacheMaxSize
}, exports);


pageCache    = new Cache({
  cacheMaxTime:   config.resultsCacheMaxTime,
  cachePurgeTime: config.resultsCachePurgeTime,
  cacheMaxSize:   config.resultsCacheMaxSize
}, exports);


resultsCache.start();
pageCache.start();