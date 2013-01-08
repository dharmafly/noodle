var fs = require('fs');

// Web document samples

exports.documents = {
  html: fs.readFileSync('tests/document.html'),
  json: fs.readFileSync('tests/document.json'),
  feed: fs.readFileSync('tests/document.atom'),
  xml:  fs.readFileSync('tests/document.xml')
};

// Queries

exports.queries = {
  simple: {
    url: 'http://localhost:8889/html',
    type: 'html',
    selector: 'title',
    extract: 'text'
  }
};