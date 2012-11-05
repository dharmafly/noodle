var q          = require('q'),
    jsonSelect = require('JSONSelect'),
    noodle;

exports._init   = function (n) {
  noodle = n;
}

exports.fetch  = fetch;
exports.select = select;

function fetch (url, options) {
  return noodle.fetch(url, options).then(function (data) {
    var parsed = JSON.parse(data);
    return select(parsed, options);
  })
}

function select (obj, options) {
  var deferred = q.defer(),
      results;

  try {
    if (!options.selector) {
      deferred.resolve(noodle._wrapResults([json], options));
    } else {
      results = jsonSelect.match(options.selector, [], json);
      if (results.length === 0) {
        deferred.reject('Could not match with that selector');
      } else {
        deferred.resolve(noodle._wrapResults(results, options));
      }
    }
  } catch (e) {
    deferred.reject('Could not match with that selector');
  }

  return deferred.promise;
}