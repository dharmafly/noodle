var q        = require('q'),
    xml2json = require('xml2json'),
    n;

exports._init   = function (n) {
  noodle = n;
}

exports.fetch  = fetch;
exports.select = select;

function fetch (url, options) {
  return noodle.fetch(url, options).then(function (xml) {
    var parsed = xml2json.toJson(xml);
    return select(parsed, options);
  });
}

function select (obj, options) {
  return noodle.json.select(obj, options);
}