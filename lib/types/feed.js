var q          = require('q'),
    feedparser = require('feedparser'),
    noodle;

exports._init   = function (n) {
  noodle = n;
}

exports.fetch  = fetch;
exports.select = select;

function fetch (url, options) {
  return noodle.fetch(url).then(function (data) {
    return select(data, options);
  });
}

function select (data, options) {
  return normalise(data).then(function (normalised) {
    return noodle.json.select(normalised);
  });
}

function normalise (body) {
  var deferred = q.defer(),
      articles = [];

  feedparser
    .parseString(body)
    .on('article', function (a) {
      articles.push(a);
    })
    .on('error', deferred.reject)
    .on('complete', function () {
      deferred.resolve(articles);
    });

  return deferred.promise;
};