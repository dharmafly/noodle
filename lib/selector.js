exports.select = function (window, query, callback) {
  var results  = [],
      jQuery   = window.jQuery,
      selector = query.selector,
      extract  = query.extract,
      i        = 0;

  function extractProperty (elem, property) {
    elem = jQuery(elem);
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

  // Pass back the extracted results from the DOM
  
  callback(results);

  // This is important. It prevents a memory leak :)
  window.close();
}