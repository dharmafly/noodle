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
    try {
      var parsed = JSON.parse(xml2json.toJson(xml));
      console.log("parsed: " + typeof parsed);
      return select(parsed, query);
    } catch (e) {
      throw new Error('Could not parsed XML to JSON');
    }
  });
}

function select (obj, query) {
  return noodle.json.select(obj, query);
}