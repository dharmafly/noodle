var _     = require('underscore'),
    time  = 1000 * 60 * 60,
    size  = 100,
    cache = [];


// Clear the cache after a certain amount of time has passed


setInterval(function () {
  cache = [];
}, time)


// Put something in the cache and then return it for convinience


exports.put = function (query, results) {
  var item = {
    query: query,
    results: results,
    created: new Date()
  };
  if (cache.length >= size) {
    cache.pop();
  }
  cache.unshift(item);
  console.log("C A C H E \n",cache);
  return exports.get(query);
};


// Check to see if query is in the cache


exports.check = function (query) {
  return find(query) || false;
}


// Get a query results from the cache or return false


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