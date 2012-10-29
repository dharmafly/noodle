var moment = require('moment'),
    util   = require('util'),
    config  = require('../lib/config'),
    scraper = require('../lib/scraper');

exports.handle = function (req, res, next) {
  var hasJSON        = (Object.keys(req.body).length  > 0),
      hasQueryString = (Object.keys(req.query).length > 0),
      queries;

  // Handle for different request types

  // Take JSON from request body (http post)
  queries = (hasJSON) ? req.body : false;
  // Take only single query JSON from request querystring (http get)
  queries = (queries === false && hasQueryString) ? req.query : queries;
  // Take JSON from request querystring (http get)
  queries = (req.query.q) ? JSON.parse(req.query.q) : queries;

  // Scrape the requested data then us finish() to respond to client

  if (queries) {
    scraper.scrape(queries, function (err, results) {
      res.results = {error: err, results: results, callback: req.query.callback};
      next();
    });
  } else {
    res.results = {error: 'No queries', callback: req.query.callback};
    next();
  }
};

exports.finish = function (req, res, next) {
  var params   = res.results,
      error    = params.error,
      callback = params.callback,
      results  = JSON.stringify(params.results);

  if (error && callback) {

    // Error as JSONP

    res.writeHead('401', {'Content-type':'text/javascript; charset=utf-8'});
    res.end(callback + '({"error": "' + error + '"})');

  } else if (error) {

    // Error as JSON

    res.writeHead('401', {'Content-type':'application/json; charset=utf-8'});
    res.end('{"error": "' + error + '"}');

  } else if (callback) {

    // Results as JSONP

    res.writeHead('200', {
      'Content-type': 'text/javascript; charset=utf-8',
      'Expires': setExpiresHeader(params.results)
    });
    res.end(callback + '(' + results + ')');

  } else {

    // Results as JSON

    res.writeHead('200', {
      'Content-type': 'application/json; charset=utf-8',
      'Expires': setExpiresHeader(params.results)
    });
    res.end(results);
  }
};

function setExpiresHeader (results) {

  // Normalise results to array and get the earliest 
  // time first (last to expire)

  results = (util.isArray(results)) ? results : [results];

  results.sort(function (a, b) {
    return (b.created || 0) - (a.created || 0);
  });

  // Return oldest to expire or return the present time for 
  // a bad result which was not cached

  if (results[0].created) {
    return moment(results[0].created.getTime() + config.cacheMaxTime)
            .format('ddd, D MMM YYYY HH:mm:ss') + ' GMT';
  } else {
    return moment(new Date())
            .format('ddd, D MMM YYYY HH:mm:ss') + ' GMT';
  }
}