var q       = require('q'),
    util    = require('util'),
    cheerio = require('cheerio'),
    noodle;

exports._init   = function (n) {
  noodle = n;
}

exports.fetch  = fetch;
exports.select = select;

function fetch (url, query) {
  return noodle.fetch(url, query).then(function (page) {
    return select(page, query);
  });
}

function select (body, query) {
  var deferred = q.defer(),
      extract  = query.extract,
      selector = query.selector,
      page     = cheerio.load(body),
      results  = [];

  function extractProperty (elem, property) {
    if (property === 'text') {
      return page(elem).text().replace(/(\r\n|\n|\r)/gm, "").trim();
    }
    else if (property === 'html' || property === 'innerHTML') {
      return page(elem).html();
    }
    else {
      return page(elem).attr(property);
    }
  };

  // Check to see if person just wants the entire page

  if (!selector) {
    deferred.resolve(noodle._wrapResults(page.html().trim(), query));
    return deferred.promise;
  }

  // Normalise extract properties to an array

  extract = (util.isArray(extract)) ? extract : [extract];

  page(selector).each(function (i, elem) {
    var item = {},
        notEmpty;

    extract.forEach(function (property) {
      property       = property || 'html';
      item[property] = extractProperty(elem, property);
      notEmpty       = notEmpty || item[property];
    });

    if (notEmpty) results.push(item);
  });

  // Pass back the extracted results from the DOM

  if (results.length === 0) {
    deferred.reject(new Error('Could not match with that selector or extract value'));
  } else {
    deferred.resolve(noodle._wrapResults(results, query));
  }

  return deferred.promise;
}