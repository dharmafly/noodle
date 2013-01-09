var fs = require('fs');

// Web document samples for the test server to serve

exports.documents = {
  html: fs.readFileSync('tests/document.html'),
  json: fs.readFileSync('tests/document.json'),
  feed: fs.readFileSync('tests/document.atom'),
  xml:  fs.readFileSync('tests/document.xml')
};

// Queries

exports.queries = {
  html: {
    simple: {
      url: 'http://localhost:8889/html',
      type: 'html',
      selector: 'title',
      extract: 'text'
    },
    noSelector: {
      url: 'http://localhost:8889/html',
      type: 'html'
    },
    noExtract: {
      url: 'http://localhost:8889/html',
      type: 'html',
      selector: 'title'
    },
    noType: {
      url: 'http://localhost:8889/html',
      selector: 'title',
      extract: 'text'
    },
    badSelector: {
      url: 'http://localhost:8889/html',
      type: 'html',
      selector: 'BAD SELECTOR',
      extract: 'text'
    },
    badExtract: {
      url: 'http://localhost:8889/html',
      type: 'html',
      selector: 'title',
      extract: 'BAD EXTRACT'
    }
  },
  json: {
    simple: {
      url: 'http://localhost:8889/json',
      type: 'json',
      selector: '.query'
    },
    noSelector: {
      url: 'http://localhost:8889/json',
      type: 'json'
    },
    noType: {
      url: 'http://localhost:8889/json',
      selector: '.query'
    },
    badSelector: {
      url: 'http://localhost:8889/json',
      type: 'json',
      selector: 'BAD SELECTOR'
    }
  },
  feed: {
    simple: {
      url: 'http://localhost:8889/feed',
      type: 'feed',
      selector: '.title'
    },
    noSelector: {
      url: 'http://localhost:8889/feed',
      type: 'feed'
    },
    noType: {
      url: 'http://localhost:8889/feed',
      selector: '.title'
    },
    badSelector: {
      url: 'http://localhost:8889/feed',
      type: 'feed',
      selector: 'BAD SELECTOR'
    }
  },
  xml: {
    simple: {
      url: 'http://localhost:8889/xml',
      type: 'xml',
      selector: '.CustomerName'
    },
    noSelector: {
      url: 'http://localhost:8889/xml',
      type: 'xml'
    },
    noType: {
      url: 'http://localhost:8889/feed',
      selector: '.CustomerName'
    },
    badSelector: {
      url: 'http://localhost:8889/xml',
      type: 'xml',
      selector: 'BAD SELECTOR'
    }
  },
  misc: {
    badUrl: {
      url: 'BAD URL'
    },
    badType: {
      url: 'http://localhost:8889/html',
      type: 'BAD TYPE'
    },
    emptyQuery: {}
  }
}