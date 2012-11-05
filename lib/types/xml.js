var q        = require('q'),
    xml2json = require('xml2json'),
    n;

exports._init   = function (n) {
  noodle = n;
}

exports.fetch  = fetch;
exports.select = select;

function fetch (url, query) {
  return noodle.fetch(url, query).then(function (xml) {
    var parsed = xml2json.toJson(xml);
    return select(parsed, query);
  });
}

function select (obj, query) {
  return noodle.json.select(obj, query);
}