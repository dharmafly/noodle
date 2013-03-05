var q        = require('q'),
    xml2json = require('xml2json'),
    noodle;

exports._init   = function (n) {
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
    return noodle.fetch(url, query).then(function (xml) {
      try {
        var parsed = JSON.parse(xml2json.toJson(xml));
        return select(parsed, query);
      } catch (e) {
        throw new Error('Could not parse XML to JSON');
      }
    });
  }
}

function select (obj, query) {
  return noodle.json.select(obj, query);
}