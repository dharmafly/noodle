var jsdom  = require('jsdom'),
    utils  = require('util'),
    fs     = require('fs'),
    jquery = fs.readFileSync('./vendor/jquery-1.4.3.min.js');

exports.scrape = function (query, callback) {
  if (valid(query)) {
    jsdom.env({
      html: query.url,
      scripts: [jquery],
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
      elems    = jQuery(selector),
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
    elems.each(function (i, elem) {
      results.push(extractProperty(elem, property));
    });
  });

  callback(false, JSON.stringify(results));
}

// Check if query supplied is OK
function valid (query) {
  return (query.url && query.selector && query.extract) ? true : false;
}