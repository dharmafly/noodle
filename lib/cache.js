var _     = require('underscore'),
    time  = 1000 * 60 * 60
    cache = [];

// Clear the cache after a certain amount of time has passed

setInterval(function () {
  cache = [];
}, time)

// Put something in the cache

exports.put = function (query, results) {
  console.log('putting in cache');
  cache.push({
    query: query,
    results: results
  });
};

// Check to see if query is in the cache

exports.check = function (query) {
  return find(query) || false;
}

// Get a query results from the cache

exports.get = function (query) {
  console.log('getting from cache');
  return find(query);
}

function find (query) {
  console.log(query);
  var i = 0;
  for (i; i < cache.length; i++) {
    if (_.isEqual(query, cache[i].query)) {
      return cache[i].results;
    }
  };
}