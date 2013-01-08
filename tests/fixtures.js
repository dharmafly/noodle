var fs = require('fs');

// Web document samples

exports.documents = {
  html: fs.readFileSync('tests/document.html'),
  json: fs.readFileSync('tests/document.json'),
  feed: fs.readFileSync('tests/document.atom'),
  xml:  fs.readFileSync('tests/document.xml')
};

// Queries

exports.querySimple = {
  url: 'http://localhost:8889',
  type: 'html',
  selector: 'body',
  extract: 'text'
};