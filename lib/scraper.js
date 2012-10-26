var util     = require('util'),
    async    = require('async'),
    request  = require('request'),
    cache    = require('./cache'),
    selector = require('./selector');

exports.scrape = function (queries, callback) {
  var asyncTasks      = [],
      cachedIndices   = [],
      asArray         = false;

  // Normalise queries to an array incase only one query was 
  // sent to the server.
  //
  // Takes note if the client sent it as an array or not:
  // If it is an array sent the response back as an array

  if (util.isArray(queries)) {
    asArray = true;
  } else {
    queries = [queries];
  }

  // Scrape the queries based on their query type.
  // Order is ensured. See github.com/caolan/async/#parallel

  queries.forEach(function (query) {
    asyncTasks.push(function (callback) {

      // If query is cached complete this asyncTask early with 
      // that query result.

      if (cache.check(query)) {
        callback(null, cache.get(query));
        console.log('From cache');
        return false;
      }

      console.log('Wasn\'t cached');

      // Differentiate the selection based of the query type
      //
      // Accept:
      //
      // - 'html' (defaults to this if no query type specified)
      // - 'json'

      function completeTask (err, result, cb) {
        if (err) {
          result = {
            results: [],
            error: err
          }
        } else {
          result = cache.put(query, result);
        }
        cb(null, result);
      }

      request(query.url, function (err, response, body) {
        if (!err && response.statusCode == 200) {

          query.type = query.type || 'html';

          if (typeof selector.select[query.type] != 'function') {
            callback(null, {results: [], error: 'Invalid query type'});
          } else {
            selector.select[query.type](body, query, function (err, result) {
              completeTask(err, result, callback);
            });
          }


        } else {
          callback(null, {results: [], error: 'Page not found'});
        }
      });

    });
  });

  // Pass the scraped/cached queries back to response.
  //
  // This callback fires when all the aynchronousTask functions 
  // (above) have called back (marked as completed).
  //
  // Async.parallel ensures order.

  async.parallel(asyncTasks, function (err, results) {
    console.log("RESULTS: \n", results);
    callback(null, (asArray) ? results : results[0]);
  });
};