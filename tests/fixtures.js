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
      url: "http://localhost:8889/html",
      type: "html",
      selector: "title",
      extract: "text",
      cache: false
    },
    noSelector: {
      url: 'http://localhost:8889/html',
      type: 'html',
      cache: false
    },
    noExtract: {
      url: 'http://localhost:8889/html',
      type: 'html',
      selector: 'title',
      cache: false
    },
    noType: {
      url: 'http://localhost:8889/html',
      selector: 'title',
      extract: 'text',
      cache: false
    },
    badSelector: {
      url: 'http://localhost:8889/html',
      type: 'html',
      selector: 'BAD SELECTOR',
      extract: 'text',
      cache: false
    },
    badExtract: {
      url: 'http://localhost:8889/html',
      type: 'html',
      selector: 'title',
      extract: 'BAD EXTRACT',
      cache: false
    }
  },
  json: {
    simple: {
      url: 'http://localhost:8889/json',
      type: 'json',
      selector: '.query',
      cache: false
    },
    noSelector: {
      url: 'http://localhost:8889/json',
      type: 'json',
      cache: false
    },
    noType: {
      url: 'http://localhost:8889/json',
      selector: '.query',
      cache: false
    },
    badSelector: {
      url: 'http://localhost:8889/json',
      type: 'json',
      selector: 'BAD SELECTOR',
      cache: false
    },
    badParse: {
      url: 'http://localhost:8889/html',
      type: 'json',
      selector: '.query',
      cache: false
    }
  },
  feed: {
    simple: {
      url: 'http://localhost:8889/feed',
      type: 'feed',
      selector: '.title',
      cache: false
    },
    noSelector: {
      url: 'http://localhost:8889/feed',
      type: 'feed',
      cache: false
    },
    noType: {
      url: 'http://localhost:8889/feed',
      selector: '.title',
      cache: false
    },
    badSelector: {
      url: 'http://localhost:8889/feed',
      type: 'feed',
      selector: 'BAD SELECTOR',
      cache: false
    },
    badParse: {
      url: 'http://localhost:8889/json',
      type: 'feed',
      selector: '.title',
      cache: false
    }
  },
  xml: {
    simple: {
      url: 'http://localhost:8889/xml',
      type: 'xml',
      selector: '.CustomerName',
      cache: false
    },
    noSelector: {
      url: 'http://localhost:8889/xml',
      type: 'xml',
      cache: false
    },
    noType: {
      url: 'http://localhost:8889/feed',
      selector: '.CustomerName',
      cache: false
    },
    badSelector: {
      url: 'http://localhost:8889/xml',
      type: 'xml',
      selector: 'BAD SELECTOR',
      cache: false
    },
    badParse: {
      url: 'http://localhost:8889/json',
      type: 'xml',
      selector: '.CustomerName',
      cache: false
    }
  },
  misc: {
    badUrl: {
      url: 'BAD URL',
      cache: false
    },
    badType: {
      url: 'http://localhost:8889/html',
      type: 'BAD TYPE',
      cache: false
    },
    emptyQuery: {}
  }
};

// Query answers

exports.queries.html.simple.answer = [
    {
        "results": [
            {
                "text": "css Zen Garden: The Beauty in CSS Design"
            }
        ],
        "created": "2013-01-11T12:14:07.016Z"
    }
];
