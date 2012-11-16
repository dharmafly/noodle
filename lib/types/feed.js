var q          = require('q'),
    feedparser = require('feedparser'),
    noodle;

exports._init   = function (n) {
  noodle = n;
}

exports.fetch  = fetch;
exports.select = select;

function fetch (url, query) {
  var deferred = q.defer();

  if (noodle.cache.check(query)) {
    console.log("cached result");
    deferred.resolve(noodle.cache.get(query));
    return deferred.promise;
  } else {
    console.log("fresh  result");
    return noodle.fetch(url, query).then(function (data) {
      return select(data, query);
    });
  }
}

function select (data, query) {
  return normalise(data).then(function (normalised) {
    return noodle.json.select(normalised, query);
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