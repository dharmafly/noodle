var q          = require('q'),
    feedparser = require('feedparser'),
    html       = require('./html');

exports.select = html.select;

exports.parse = function (body) {
  var deferred = q.defer(),
      articles = [];

  feedparser
    .parseString(body, {normalise: false})
    .on('article', function (a) {
      articles.push(a);
    })
    .on('error', deferred.reject)
    .on('complete', function () {
      deferred.resolve(articles);
    });

  return deferred.promise;
};