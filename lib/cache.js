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
        console.log('noodle cached purged @ ' + new Date());
      }, config.cachePurgeTime)
    }
  };


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
  

  this.check = function (key) {
    return (find(key)) ? true : false;
  };


  this.get = function (key) {
    var item  = find(key),
        clone = _.clone(item);

    delete clone.key;
    return clone;
  };

  // Expose cache for debugging purposes
  this.getCache = function () {
    return cache;
  };

  function find (key) {
    var i = 0;
    for (i; i < cache.length; i++) {
      if (_.isEqual(key, cache[i].key)) {
        return cache[i];
      }
    }
  }
}
