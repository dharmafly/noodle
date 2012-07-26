var _     = require('underscore'),
    time  = 1000 * 60 * 60,
    cache = [];


// Clear the cache after a certain amount of time has passed


setInterval(function () {
  cache = [];
}, time)


// Put something in the cache


exports.put = function (query, results) {
  var item = {
    query: query,
    results: results,
    created: new Date()
  };
  cache.push(item);
  return exports.get(query);
};


// Check to see if query is in the cache


exports.check = function (query) {
  return find(query) || false;
}


// Get a query results from the cache


exports.get = function (query) {
  var item  = find(query),
      clone = _.clone(item);
  delete clone.query;
  return clone;
}

function find (query) {
  var i = 0;
  for (i; i < cache.length; i++) {
    if (_.isEqual(query, cache[i].query)) {
      return cache[i];
    }
  }
}