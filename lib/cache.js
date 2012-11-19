var _ = require('underscore');

module.exports = function Cache (config) {
  var cache = [];

  this.start = function () {

    // Check to see if a cache item is to be removed 
    // from the cache (expired)

    setInterval(function () {
      var now           = new Date().getTime(),
          initialLength = cache.length,
          x             = 0,
          out           = [];

      initialLength = cache.length;

      while (x < initialLength) {
        if ((now - cache[x].created) < config.cacheMaxTime) {
          out.unshift(cache[x]);
        }
        x++;
      }

      cache = out;
    }, 10000);

    // Remove all cache entries every time the cache purge time is reached

    if (config.cachePurgeTime > 0) {
      setInterval(function () {
        cache = [];
        console.log('Cached purged @ ' + new Date());
      }, config.cachePurgeTime)
    }
  };


  this.put = function (query, results) {
    var item = {
      key: query,
      value: results,
      created: new Date()
    };

    if (cache.length >= config.maxSize) {
      cache.pop();
    }

    cache.unshift(item);

    console.log("CACHE:", cache);
    consoel.log(":END");
    return this.get(query);
  };
  

  this.check = function (query) {
    return find(query) || false;
  };


  this.get = function (query) {
    var item  = find(query),
        clone = _.clone(item);
        
    delete clone.key;
    return clone;
  };

  function find (query) {
    var i = 0;
    for (i; i < cache.length; i++) {
      if (_.isEqual(query, cache[i].key)) {
        return cache[i];
      }
    }
  }
}