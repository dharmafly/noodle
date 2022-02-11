exports = require('./lib/noodle.js');

var noodle = require('noodlejs');

noodle.query({
  url:      'https://github.com/explore',
  selector: 'ol.ranked-repositories h3 a',
  extract:  'href'
})
.then(function (results) {
  console.log(results);
});