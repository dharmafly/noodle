var _     = require('underscore'),
    cache = [];

exports.put = function (query, results) {
  console.log('putting in cache');
  cache.push({
    query: query,
    results: results
  });
};

exports.check = function (query) {
  return find(query) || false;
}

exports.get = function (query) {
  console.log('getting from cache');
  return find(query);
}

function find (query) {
  var i = 0;
  for (i; i < cache.length; i++) {
    if (_.isEqual(query, cache[i])) {
      return cache[i].results;
    }
  };
}
