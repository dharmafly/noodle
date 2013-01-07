var zlib   = require('zlib'),
    util   = require('util'),
    async  = require('async'),
    moment = require('moment'),
    noodle = require('../lib/noodle');

exports.parseQueries = function (req, res, next) {
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

  // Handle query(s) with noodle or fail early

  if (queries) {
    res.queries = queries;
    next();
  } else {
    res.noodleData = {error: 'No query'};
    exports.respond(req, res);
  }
};

exports.noodleQueries = function (req, res, next) {
  noodle.query(res.queries).then(function (results) {
    res.noodleData = results;
    next();
  });
};

exports.respond = function (req, res) {
  var error    = res.noodleData.error,
      callback = req.query.callback;

  if (error) {
    res.statusCode = 401;
    responseBody = '{"results": [], "error":"' + error + '"}';
  } else {
    res.statusCode = 200;
    res.setHeader('Expires', setExpiresHeader(res.noodleData.results));
    responseBody = JSON.stringify(res.noodleData.results);
  }

  if (callback) {
    res.setHeader('Content-Type', 'application/javascript');
    responseBody = callback + '(' + responseBody + ')';
  } else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }

  responseBody = new Buffer(responseBody, 'utf8');

  if (req.headers['accept-encoding']) {
    res.setHeader('content-encoding', 'gzip');
    zlib.gzip(responseBody, function (err, buffer) {
      res.end(buffer);
    });
  } else {
    res.end(responseBody);
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
    return moment(results[0].created.getTime() + noodle.config.resultsCacheMaxTime)
            .format('ddd, D MMM YYYY HH:mm:ss') + ' GMT';
  } else {
    return moment(new Date())
            .format('ddd, D MMM YYYY HH:mm:ss') + ' GMT';
  }
};