var q            = require('q'),
    fs           = require('fs'),
    request      = require('request'),
    Cache        = require('lib/cache'),
    config       = JSON.parse(fs.readFileSync('lib/config.json')),
    typeHandlers = {},
    resultsCache,
    pageCache;

exports.ActiveQuery = function ActiveQuery (query, i) {
  this.url         = query.url         || this.url;
  this.type        = query.type        || this.type;
  this.selector    = query.selector    || this.selector;
  this.each        = query.each        || this.each;
  this.map         = query.map         || this.map;
  this.cache       = query.cache       || this.cache;
  this.post        = query.post        || this.post;
  this.headers     = query.headers     || this.headers;
  this.linkHeaders = query.linkHeaders || this.linkHeaders;
  
  this.orderNo     = i;
  this.query       = query;

  return this.fetch()
             .then(this.select)
             .then(this._applyHeaders)
             .then(this._cacheResults);
};

ActiveQuery.prototype = {
  // Active query properties

  url:            null;
  type:           config.defaultDocumentType,
  userAgent       config.userAgent,
  selector:       null,
  each:           null,
  map:            null,
  cache:          true,
  post:           false,
  headers:        [],
  linkHeaders:    false,

  // Active query state variables

  results:        null,
  hasPage:        false,
  fetchedPage:    null,
  fetchedHeaders: null,
  requestOptions: {
    uri:     this.url,
    method:  'GET',
    headers: {'user-agent': this.userAgent}
  },

  // ------------------------------------------------------------
  // Uses a type handler (html, json, xml etc) to select from 
  // the web document
  // ------------------------------------------------------------

  select: function () {
    return typeHandlers[this.type].select(this);
  },

  // ------------------------------------------------------------
  // Fetch a web document (possibly from cache) with a url.
  // ------------------------------------------------------------

  fetch: function () {
    var deferred = q.defer(),
        requestOptions;
    
    if (this.url) {
      this.hasPage = pageCache.check(this.url);

      if (this.post) {
        requestOptions.method = 'POST';
        requestOptions.body   = serialize(this.post);
        this.cache            = false;
      }

      if (hasPage && this.cache) {
        deferred.resolve(pageCache.get(url).value.body);
      } else {
        this._getDocument(function (docOrErr) {
          deferred.resolve(docOrErr);
        });
      }
    } else {
      deferred.resolve(new Error('No url specified'));
    }

    return q.promise;
  },

  _getDocument: function (fn) {
    request(this.requestOptions, function (err, response, body) {
      if (err || response.statusCode !== 200) {
        fn(new Error('Document not found'));
      } else {
        this.fetchedPage    = body;
        this.fetchedHeaders = response.headers;
        if (this.cache && !this.hasPage) {
          this._cachePage();
        }
        fn(body);
      }
    });
  },

  _applyHeaders: function () {
    var q = q.defer();

    return q.promise;
  },

  _cachePage: function (body, headers) {
    pageCache.put(this.url, {
      body:    this.fetchedPage,
      headers: this.fetchedHeaders
    });
    exports.events.emit('cache/page', pageCache.get(this.url));
  },

  _cacheResults: function () {

  }
};

// Initialize cache based on config

resultsCache = new Cache({
  cacheMaxTime:   config.resultsCacheMaxTime,
  cachePurgeTime: config.resultsCachePurgeTime,
  cacheMaxSize:   config.resultsCacheMaxSize
});

pageCache    = new Cache({
  cacheMaxTime:   config.resultsCacheMaxTime,
  cachePurgeTime: config.resultsCachePurgeTime,
  cacheMaxSize:   config.resultsCacheMaxSize
});

// Put document type handlers in memory

fs.readdirSync('lib/types/').forEach(function (file) {
  file = file.substr(0, file.lastIndexOf('.'));
  typeHandlers[file] = require('./types/' + file);
  typeHandlers[file]._init(exports);
});