var jsdom = require('jsdom');

exports.scrape = scrape;

function scrape (query, callback) {
  if(valid(query)){
    jsdom.env({
      html: query.url,
      scripts: ['http://code.jquery.com/jquery-1.5.min.js'],
      done: function (error, window) {
        if (!error) {
          select(window.jQuery, query.selector, query.extract, callback);
        } else {
          callback('error');
        }
      }
    });

  } else {
    callback('error');
  };
}

function select (jq, selector, extract, callback) {
  var results = [];

  if (extract === 'html') {
    jq(selector).each(function (i, elem) {
      results.push(jq(elem).html());
    });
    callback(false, JSON.stringify(results));
  } else if (extract) {
    jq(selector).each(function (i, elem) {
      results.push(jq(elem).attr(extract));
    });
    callback(false, JSON.stringify(results));
  } else {
    jq(selector).each(function (i, elem) {
      results.push(elem.outerHTML);
    });
    callback(false, JSON.stringify(results));
  }
}

// Check if query supplied is OK
function valid (query) {
  return (query.url && query.selector) ? true : false;
}