var jsdom  = require('jsdom'),
    utils  = require('util');

jsdom.defaultDocumentFeatures = {
  QuerySelector: true
};

exports.scrape = function (query, callback) {
  if (valid(query)) {
    jsdom.env({
      html: query.url,
      done: function (error, window) {
        if (!error) {
          select(window.document, query.selector, query.extract, callback);
        } else {
          callback('error');
        }
      }
    });
  } else {
    callback('error');
  };
}

function select (document, selector, extract, callback) {
  var results  = {},
      elems    = document.querySelector(selector),
      i        = 0;

  function extractProperty (elem, property) {
    return (property === 'html') ? elem.innerHTML : elem.getAttribute(property);
  };

  // Prepare results object

  extract.forEach(function (property) {
    results[property] = [];
  });

  // For each extraction property (either html or an html attribute)
  //   then gather all values in the resepcted results key

  extract.forEach(function (property) {
    for (i; i < elems.length; i++) {
      elems[i].push(extractProperty(elems[i], property));
    };
  });

  callback(false, JSON.stringify(results));
}

// Check if query supplied is OK
function valid (query) {
  return (query.url && query.selector && query.extract) ? true : false;
}