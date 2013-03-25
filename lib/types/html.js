var q       = require('q'),
    util    = require('util'),
    cheerio = require('cheerio'),
    noodle;

exports._init  = function (n) {
  noodle = n;
};

exports.fetch  = fetch;
exports.select = select;

function fetch (url, query) {
  var deferred = q.defer();

  if (noodle.cache.check(query)) {
    deferred.resolve(noodle.cache.get(query).value);
    return deferred.promise;
  } else {
    return noodle.fetch(url, query).then(function (page) {
      return select(page, query);
    });
  }
}

function select (body, query) {
  var deferred = q.defer(),
      extract  = query.extract || 'text',
      selector = query.selector,
      page     = cheerio.load(body),
      selected = page(selector),
      results  = [];

  if (!selector) {
    deferred.resolve(noodle._wrapResults(body.trim(), query));
    return deferred.promise;
  }
  else if (util.isArray(extract)) {
    selected.each(function (i, elem) {
      var item = {},
          notEmpty;

      extract.forEach(function (property) {
        item[property] = extractProperty(page, elem, property);
        notEmpty       = notEmpty || item[property];
      });

      if (notEmpty) {
        results.push(item);
      }
    });
  }
  else {
    selected.each(function (i, elem) {
      results.push(extractProperty(page, elem, extract));
    });
  }

  // Pass back the extracted results from the DOM

  if (results.length === 0) {
    deferred.reject(new Error('Could not match with that selector or extract value'));
  } else {
    deferred.resolve(noodle._wrapResults(results, query));
  }

  return deferred.promise;
}

function extractProperty (page, elem, property) {
  if (property === 'text') {
    return page(elem).text().replace(/(\r\n|\n|\r)/gm, "").trim();
  }
  else if (property === 'html' || property === 'innerHTML') {
    return page(elem).html();
  }
  else {
    return page(elem).attr(property);
  }
}