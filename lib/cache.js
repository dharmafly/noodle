var _     = require('underscore'),
    cache = [];

exports.put = function (query, results) {
  console.log('putting in cache');
  console.log(cache);
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
  console.log(query);
  var i = 0;
  for (i; i < cache.length; i++) {
    if (_.isEqual(query, cache[i].query)) {
      return cache[i].results;
    }
  };
}
