var jsdom  = require('jsdom'),
    fs     = require('fs'),
    jquery = fs.readFileSync('./vendor/jquery-1.4.3.min.js').toString();

exports.scrape = function (query, callback) {
  if (valid(query)) {
    jsdom.env({
      html: query.url,
      src: [jquery],
      done: function (error, window) {
        if (!error) {
          select(window, query.selector, query.extract, callback);
        } else {
          callback('error');
        }
      }
    });
  } else {
    callback('error');
  };
}

function select (window, selector, extract, callback) {
  var results  = {},
      document = window.document,
      elems    = window.jQuery(selector),
      i        = 0;

  function extractProperty (elem, property) {
    return (property === 'text') ? elem.innerHTML : elem.getAttribute(property);
  };

  extract = (window.jQuery.isArray(extract)) ? extract : [extract];

  // Prepare results object

  extract.forEach(function (property) {
    results[property] = [];
  });

  // For each extraction property (either html or an html attribute)
  //   then gather all values in the resepcted results key

  extract.forEach(function (property) {
    elems.each(function (i, elem) {
      results[property].push(extractProperty(elem, property));
    });
  });

  callback(false, JSON.stringify(results));
}

// Check if query supplied is OK
function valid (query) {
  return (query.url && query.selector && query.extract) ? true : false;
}