var _     = require('underscore'),
    cache = [];

exports.put = function (query, results) {
  cache.push({
    query: query,
    results: results
  });
};

exports.check = function (query) {
  return find(query) || false;
}

exports.get = function (query) {
  return find(query);
}

function find (query) {
  var i = 0;
  for (i; i < limit; i++) {
    if (_.(query, cache[i])) {
      return cache[i].results;
    }
  };
}
