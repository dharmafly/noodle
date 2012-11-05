var util    = require('util'),
    cheerio = require('cheerio'),
    noodle;

exports._init   = function (n) {
  noodle = n;
}

exports.fetch  = fetch;
exports.select = select;

function fetch (url, options) {
  return noodle.fetch(url, options).then(function (page) {
    select(page, options).then(function (res) {
      console.log(res);
    });
    return select(page, options);
  });
}

function select (body, options) {
  var deferred = q.defer(),
      extract  = options.extract,
      selector = options.selector,
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
    deferred.resolve(noodle._wrapResults(page.html().trim(), options));
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
    deferred.reject('Could not match with that selector or extract value');
  } else {
    deferred.resolve(noodle._wrapResults(results));
  }

  return deferred.promise;
}