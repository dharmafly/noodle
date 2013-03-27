var util    = require('util'),
    cheerio = require('cheerio');

exports.select = function (query) {
  var extract  = query.extract || 'text',
      selector = query.selector,
      page     = cheerio.load(query.fetchedPage),
      selected = page(selector),
      results  = [];

  // {
  //   map: {
  //     person: {
  //       selector: 'td.person'
  //     },
  //     age: {
  //       selector: 'td.age'
  //     }
  //   },
  //   mapTransform: {
  //     
  //   }
  // }


  if (!selector) {
    return query.fetchedPage.trim();
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
    return new Error('Could not match with that selector or extract value');
  } else {
    return results;
  }
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