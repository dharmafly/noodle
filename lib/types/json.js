var jsonSelect = require('JSONSelect');

exports.select = function (body, query, callback) {
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
};