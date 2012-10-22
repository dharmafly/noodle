var util     = require('util'),
    async    = require('async'),
    jsdom    = require('jsdom'),
    request  = require('request'),
    cache    = require('./cache'),
    selector = require('./selector'),
    jquery   = require('fs')
                .readFileSync('./vendor/jquery-1.4.3.min.js').toString();

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
  // See: github.com/caolan/async/#parallel

  queries.forEach(function (query) {
    asyncTasks.push(function (callback) {

      // If query is cached complete this asyncTask early with 
      // that query result.

      if (cache.check(query)) {
        callback(null, cache.get(query));
        console.log('cached');
        return false;
      }
      console.log('uncached');
      // Differentiate the selection based of the query type
      // Accepts:
      //
      // - 'html' (defaults to this if no query type specified)
      // - 'json'

      switch (query.type) {
        case 'json':
        
        request(query.url, function (err, response, body) {
          if (!err && response.statusCode == 200) {
            selector.selectJSON(body, query, function (err, results) {
              results = cache.put(query, results);
              if (err) results.error = err;
              callback(err, results);
            });
          } else {
            callback(err, null);
          }
        });

        break;
        default: // query type is html

        jsdom.env({
          html: query.url,
          src: [jquery],
          done: function (err, window) {
            if (!err) {
              selector.selectHTML(window, query, function (err, results) {
                results = cache.put(query, results);
                if (err) results.error = err;
                callback(err, results);
              });
            } else {
              callback(err, null);
            }
          }
        });

      }

    });
  });


  // Pass the scraped/cached queries back to response.
  //
  // This callback fires when all the aynchronousTask functions 
  // (above) have called back (marked as completed).
  //
  // Async.parallel ensures order.

  async.parallel(asyncTasks, function (err, results) {
    callback(null, (asArray) ? results : results[0]);
  });
};