var messages = 0;

module.exports = function (noodle) {
  var events = noodle.events,
      config = noodle.config;

  // Called when a page is cached
  events.on('cache/page', function (cachePage) {
    if (config.debug) {
      console.log('Cache: Page has been cached');
      seperator();
    }
  });

  // Called when a result is cached
  events.on('cache/result', function (cacheResult) {
    if (config.debug) {
      seperator();
      console.log('Cache: Result has been cached');
    }
  });

  // Called when the cache is purged
  events.on('cache/purge', function (when, next) {
    if (config.debug) {
      seperator();
      console.log('Cache: Purge @ ' + when + ' next in ' + next);
    }
  });

  // Called when a cached item has expired from the cache
  events.on('cache/expire', function (item, next) {
    if (config.debug) {
      seperator();
      console.log('Cache: An item expired from cache, next in ' + next);
    }
  });

};

function seperator () {
  console.log('\n');
  console.log('noodle log   #' + (++messages));
  console.log(new Date());
}