var jsdom  = require('jsdom'),
    fs     = require('fs'),
    cache  = require('./cache'),
    jquery = fs.readFileSync('./vendor/jquery-1.4.3.min.js').toString();

exports.scrape = function (query, callback) {
  if (valid(query)) {

    // query is cached, use the cached results

    if (cache.check(query)) {
      callback(false, cache.get(query));
    } 

    // query isn't cached, scrape the results

    else {
      jsdom.env({
        html: query.url,
        src: [jquery],
        done: function (error, window) {
          if (!error) {
            select(window, query, callback);
          } else {
            callback('error');
          }
        }
      });
    }

  } else {
    callback('error');
  }
};

function select (window, query, callback) {
  var results  = [],
      document = window.document,
      jQuery   = window.jQuery,
      selector = query.selector,
      extract  = query.extract,
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

  results = JSON.stringify(results);
  
  cache.put(query, results);
  
  callback(false, results);
}

// Check if query supplied is OK
function valid (query) {
  return (query.url && query.selector && query.extract) ? true : false;
}