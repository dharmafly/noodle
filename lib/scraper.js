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
  var results  = [],
      document = window.document,
      jQuery   = window.jQuery,
      i        = 0;

  function extractProperty (elem, property) {
    elem = jQuery(elem);
    if (property === 'text')  {
      return elem.text();
    }
    else if (property === 'html'|| property === 'innerHTML') {
      return elem.html();
    }
    else {
      return elem.attr(property);
    }
  };

  extract = (jQuery.isArray(extract)) ? extract : [extract];

  jQuery(selector).each(function (i, elem) {
    var item = {},
        notEmpty;
    extract.forEach(function (property) {
      item[property] = extractProperty(elem, property);
      notEmpty = notEmpty || item[property];
    });
    if (notEmpty) results.push(item);
  });

  window.close();
  callback(false, JSON.stringify(results));
}

// Check if query supplied is OK
function valid (query) {
  return (query.url && query.selector && query.extract) ? true : false;
}