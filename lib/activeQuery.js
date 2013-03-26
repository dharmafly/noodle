var fs     = require('fs'),
    q      = require('q'),
    config = JSON.parse(fs.readFileSync('lib/config.json'));

exports.ActiveQuery = function ActiveQuery (query) {
  this.cache   = query.cache   || this.cache;
  this.forEach = query.forEach || this.forEach;
};

ActiveQuery.prototype = {
  type:     config.defaultDocumentType || 'html',
  cache:    true,
  cached:   false,
  map:      null,
  forEach:  null,

  select:   function () {

  }
};