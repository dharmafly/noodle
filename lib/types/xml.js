var q      = require('q'),
    parser = require('xml2json-light'),
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
        var parsed = parser.xml2json(xml);
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