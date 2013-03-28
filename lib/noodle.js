var q            = require('q'),
    fs           = require('fs'),
    Query        = require('./query'),
    _            = require('underscore');

// ------------------------------------------------------------
// Main noodle entry point for usage.
// 
// Accepts one or an array of noodle queries. Based on the 
// query type it will make use of the appropriate type module 
// to do the processing.
//
// See docs/ for information on what noodle queries can be
// written.
// ------------------------------------------------------------

exports.query = function (queries) {
  queries = _.isArray(queries) ? queries : [queries],

  // Transform each query into an active query

  queries = queries.map(function (query) {
    return new Query.ActiveQuery(query).promiseResults();
  });

  // Return master promise when all queries have resolved

  return q.all(queries)
          .then(function (results) {
            return {results: results};
          });
};

// ------------------------------------------------------------
// Set and expose noodle's config
// ------------------------------------------------------------

exports.config = JSON.parse(fs.readFileSync('lib/config.json'));

// ------------------------------------------------------------
// Accepts a full or part config object an extends it over
// the existing noodle config.
//
// This is a way to programmatically configure the config 
// without touching lib/config.json
// ------------------------------------------------------------

exports.configure = function (obj) {
  config = _.extend(config, obj);
};

// Function called from exports.query()
//
// Takes in a query in the map notation
//
// For each map property, a call to the appropriate type module
// is done and the result is grabbed for that map property's
// value.
//
// When all properties are mapped with values this function calls
// back to exports.query().

function map (query, callback) {
  var promises        = [],
      mappedContainer = {},
      getResultSet,
      toPush,
      mapTo;

  getResultSet = function (mapTo, query) {
    query.map[mapTo].url   = query.url;
    query.map[mapTo].cache = query.cache;

    return exports[query.type].fetch(query.url, query.map[mapTo])
            .then(function (result) {
              mappedContainer[mapTo] = result.results;
            })
            .fail(function (error) {
              mappedContainer[mapTo] = {results: [], error: error.message};
            });
  };

  for (mapTo in query.map) {
    promises.push(getResultSet(mapTo, query));
  }

  q.all(promises)
    .then(function () {
      callback(null, exports._wrapResults(mappedContainer, query));
    })
    .fail(function (error) {
      callback(error);
    });
}