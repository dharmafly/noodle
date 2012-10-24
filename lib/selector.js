var util       = require('util'),
    cheerio    = require('cheerio'),
    jsonSelect = require('JSONSelect');

exports.select = {
  json: selectJSON,
  html: selectHTML
};

function selectHTML (body, query, callback) {
  var results = [],
      page    = cheerio.load(body),
      extract = query.extract;

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

  if (!query.selector) {
    callback(null, [page.html().trim()]);
    return false;
  } 

  // Normalise extract properties to an array

  extract = (util.isArray(extract)) ? extract : [extract];

  page(query.selector).each(function (i, elem) {
    var item = {},
        notEmpty;

    extract.forEach(function (property) {
      property = property || 'html';
      item[property] = extractProperty(elem, property);
      notEmpty       = notEmpty || item[property];
    });
    
    if (notEmpty) results.push(item);
  });

  // Pass back the extracted results from the DOM
  
  if (results.length === 0) {
    callback('Could not match with that selector or extract value');
  } else {
    callback(null, results);
  }

}

function selectJSON (body, query, callback) {
  var json, results;

  try {
    json = JSON.parse(body);
    try {
      if (!query.selector) {
        callback(null, [json]);
      } else {
        results = jsonSelect.match(query.selector, [], json);
        if (results.length === 0) {
          callback('Could not match with that selector');
        } else {
          callback(null, results);
        }
      }
    } catch (e) {
      callback('Could not match with that selector');
    }
  } catch (e) {
    callback("Could not parse JSON document");
  }

}