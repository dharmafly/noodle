require('colors');

var messages = 0;

module.exports = function (noodle) {
  var events = noodle.events,
      config = noodle.config;
      
  function toTerminal(message) {
    if (config.debug) {
      console.log(('\n[noodle log   #' + ++messages + ']').magenta);
      console.log(new Date().toString().magenta);
      console.log((message + '\n').green);
    }
  }

  // Called on a query
  events.on('noodle/query', function (query) {
    toTerminal('Noodle: The query follows...\n' + JSON.stringify(query));
  });

  // Called when a page is cached
  events.on('cache/page', function (cachePage) {
    toTerminal('Cache: Page has been cached');
  });

  // Called when a result is cached
  events.on('cache/result', function (cacheResult) {
    toTerminal('Cache: Result has been cached');
  });

  // Called when the cache is purged
  events.on('cache/purge', function (when, next) {
    toTerminal('Cache: Purge @ ' + when + ' next in ' + next);
  });

  // Called when a cached item has expired from the cache
  events.on('cache/expire', function (item, next) {
    toTerminal('Cache: An item expired from cache, next in ' + next);
  });
}