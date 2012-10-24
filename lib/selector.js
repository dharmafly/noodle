var util       = require('util'),
    cheerio    = require('cheerio'),
    jsonSelect = require('JSONSelect');

exports.select = {
  json: selectJSON,
  html: selectHTML
};

function selectHTML (body, query, callback) {
  var results  = [],
      page     = cheerio.load(body),
      extract  = query.extract,
      i        = 0;

  function extractProperty (elem, property) {
    elem = page(elem);
    if (property === 'text')  {
      return elem.text().replace(/(\r\n|\n|\r)/gm, "").trim();
    }
    else if (property === 'html' || property === 'innerHTML') {
      return elem.html();
    }
    else {
      return elem.attr(property);
    }
  };

  // Normalise extract properties to an array
  extract = (util.isArray(extract)) ? extract : [extract];

  page(query.selector).each(function (i, elem) {
    var item = {},
        notEmpty;
        
    extract.forEach(function (property) {
      item[property] = extractProperty(elem, property);
      notEmpty       = notEmpty || item[property];
    });
    
    if (notEmpty) results.push(item);
  });

  // Pass back the extracted results from the DOM
  
  callback(null, results);
}

function selectJSON (body, query, callback) {
  var json, results;

  try {
    json = JSON.parse(body);
    try {
      results = jsonSelect.match(query.selector, [], json);
      if (results.length === 0) {
        callback('Could not match with that selector');
      } else {
        callback(null, results);
      }
    } catch (e) {
      callback('Could not match with that selector');
    }
  } catch (e) {
    callback("Could not parse JSON document");
  }

}