var _     = require('underscore'),
    cache = [];

exports.put = function (query) {
  cache.push(query);
};

exports.check = function (query) {
  return found(query) || false;
}

exports.get = function (query) {
  return found(query);
}

function found (query) {
  var i = 0;
  for (i; i < limit; i++) {
    if (_.(query, cache[i])) {
      return cache[i];
    }
  };
}
