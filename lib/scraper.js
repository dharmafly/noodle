var util     = require('util'),
    jsdom    = require('jsdom'),
    async    = require('async'),
    cache    = require('./cache'),
    selector = require('./selector'),
    jquery   = require('fs').readFileSync('./vendor/jquery-1.4.3.min.js')
                            .toString();

exports.scrape = function (queries, callback) {
  var asyncTasks      = [],
      resultsCached   = [],     // from the cache
      resultsToQuery  = [],     // to be scraped with jsdom
      asArray         = false;


  // Normalise queries to an array incase only one query was 
  // sent to the server.
  // Takes note if the client sent it as an array or not:
  // If it is an array sent the response back as an array


  if (util.isArray(queries)) {
    asArray = true;
  } else {
    queries = [queries];
  }

  console.log('Passed as array:', asArray);


  // Allot any cached queries to resultsCached and put 
  // ones which need to be scraped in resultsToQuery


  queries.forEach(function (query) {
    if (cache.check(query)) {
      resultsCached.push(cache.get(query));
    } else {
      resultsToQuery.push(query);
    }
  });


  // Scrape the non-cached queries with jsdom.
  // See: github.com/caolan/async/#parallel


  console.log('resultsToQuery[0]:\n', resultsToQuery[0]);
  if (resultsToQuery.length > 0) {

    resultsToQuery.forEach(function (query) {
      asyncTasks.push(function (callback) {
        jsdom.env({
          html: query.url,
          src:  [jquery],
          done: function (error, window) {
            selector.select(window, query, function (results) {
              results = cache.put(query, results);
              callback(null, results);
            });
          }
        });
      });
    });


    // Pass the scraped and cached queries back to resposne.
    // This callback fires when all the aynchronousTask functions 
    // (above) have called back (marked as completed).


    async.parallel(asyncTasks, function (err, results) {
      var results = results.concat(resultsCached);
      console.log('not cache route: ', results);
      callback(null, (asArray) ? results : results[0]);
    });

  } else {
    // No need to scrape; just pass the cached queries

    console.log('cache route: ', resultsCached);
    callback(null, (asArray) ? resultsCached : resultsCached[0]);
  }
};