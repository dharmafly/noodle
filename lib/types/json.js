var q          = require('q'),
    jsonSelect = require('JSONSelect'),
    noodle;

exports._init = function (n) {
  noodle = n;
};

exports.fetch  = fetch;
exports.select = select;

function fetch (url, query) {
  var deferred = q.defer();

  if (noodle.cache.check(query)) {
    deferred.resolve(noodle.cache.get(query).value);
    return deferred.promise;
  } else {
    return noodle.fetch(url, query).then(function (data) {
      try {
        var parsed = JSON.parse(data);
        return select(parsed, query);
      } catch (e) {
        throw new Error('Could not parse JSON document');
      }
    });
  }
}

function select (parsed, query) {
  var deferred = q.defer(),
      results;

  try {
    if (!query.selector) {
      deferred.resolve(noodle._wrapResults([parsed], query));
    } else {
      results = jsonSelect.match(query.selector, [], parsed);
      if (results.length === 0) {
        deferred.reject(new Error('Could not match with that selector'));
      } else {
        deferred.resolve(noodle._wrapResults(results, query));
      }
    }
  } catch (e) {
    deferred.reject(new Error('Could not match with that selector'));
  }

  return deferred.promise;
}