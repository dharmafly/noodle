var _ = require('underscore');

// ------------------------------------------------------------
// Cache class which can store, expose, expire and purge all
// items in its memory.
//
// Two instances of Cache exist as pageCache and resultsCache
// in noodle.js.
// ------------------------------------------------------------

module.exports = function Cache (config, noodle) {
  var cache = [],
      intervalId1,
      intervalId2;

  // ------------------------------------------------------------
  // Starts the interval for cache purging and cache expiry.
  // Called from noodle.js.
  // ------------------------------------------------------------

  this.start = function () {

    // Check to see if a cache item is to be removed from the 
    // cache (expired).

    intervalId1 = setInterval(function () {
      var now           = new Date().getTime(),
          initialLength = cache.length,
          x             = 0,
          keep          = [];

      while (x < initialLength) {
        if ((now - cache[x].created) < config.cacheMaxTime) {
          keep.unshift(cache[x]);
        } else {
          noodle.events.emit('cache/expire', cache[x], config.cacheMaxTime);
        }
        x++;
      }

      cache = keep;
    }, 10000);

    // Remove all cache entries every time the cache purge time 
    // is reached.

    if (config.cachePurgeTime > 0) {
      intervalId2 = setInterval(function () {
        cache = [];
        noodle.events.emit('cache/purge', new Date(), config.cachePurgeTime);
      }, config.cachePurgeTime);
    }
  };

  // ------------------------------------------------------------
  // Store an object in the cache tied to specific key.
  // 
  // In noodle: resultsCache stores a result set with the query
  // being the key. pageCache stores a document and its headers
  // with the url being the key. 
  // ------------------------------------------------------------

  this.put = function (key, value) {
    var item = {
      key: key,
      value: value,
      created: new Date()
    };

    if (cache.length >= config.maxSize) {
      cache.pop();
    }

    cache.unshift(item);
    return this.get(key);
  };
  
  // ------------------------------------------------------------
  // Boolean representing if an item exists for a specific key.
  // ------------------------------------------------------------

  this.check = function (key) {
    return (find(key)) ? true : false;
  };

  // ------------------------------------------------------------
  // Returns a cached item based on a specific key.
  //
  // Cached items are objects with the following structure:
  //
  // {
  //   created: <JavaScript date>
  //   value:   <The Object stored> 
  // }
  // ------------------------------------------------------------

  this.get = function (key) {
    var item  = find(key),
        clone = _.clone(item);

    delete clone.key;
    return clone;
  };

  // ------------------------------------------------------------
  // The cache array is exposed. Useful for debugging purposes.
  // ------------------------------------------------------------
  
  this.getCache = function () {
    return cache;
  };

  // ------------------------------------------------------------
  // Stops running the intervals for the cache checking. Useful
  // for removing cache objects from the event loop and keeping
  // the node process from running indefinitely.
  // ------------------------------------------------------------

  this.stop = function () {
    clearInterval(intervalId1);
    clearInterval(intervalId2);
  };

  // Loops through the cache array finding the cached item 
  // associated with the key.

  function find (key) {
    var i = 0;
    for (i; i < cache.length; i++) {
      if (_.isEqual(key, cache[i].key)) {
        return cache[i];
      }
    }
  }
};
