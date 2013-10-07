var fs = require("fs");

// Web document samples for the test server to serve

exports.documents = {
  html: fs.readFileSync("tests/document.html"),
  json: fs.readFileSync("tests/document.json"),
  feed: fs.readFileSync("tests/document.atom"),
  xml:  fs.readFileSync("tests/document.xml")
};

// Queries

exports.queries = {
  html: {
    simple: {
      "url": "http://localhost:8889/html",
      "type": "html",
      "selector": "title",
      "extract": "text",
      "cache": false
    },
    withCache: {
      "url": "http://localhost:8889/html",
      "type": "html",
      "selector": "h1",
      "extract": "text",
      "cache": true
    },
    noSelector: {
      "url": "http://localhost:8889/html",
      "type": "html",
      "cache": false
    },
    noExtract: {
      "url": "http://localhost:8889/html",
      "type": "html",
      "selector": "title",
      "cache": false
    },
    noType: {
      "url": "http://localhost:8889/html",
      "selector": "title",
      "extract": "text",
      "cache": false
    },
    badSelector: {
      "url": "http://localhost:8889/html",
      "type": "html",
      "selector": "BAD SELECTOR",
      "extract": "text",
      "cache": false
    },
    badExtract: {
      "url": "http://localhost:8889/html",
      "type": "html",
      "selector": "title",
      "extract": "BAD EXTRACT",
      "cache": false
    }
  },
  json: {
    simple: {
      "url": "http://localhost:8889/json",
      "type": "json",
      "selector": ".query",
      "cache": false
    },
    noSelector: {
      "url": "http://localhost:8889/json",
      "type": "json",
      "cache": false
    },
    noType: {
      "url": "http://localhost:8889/json",
      "selector": ".query",
      "cache": false
    },
    badSelector: {
      "url": "http://localhost:8889/json",
      "type": "json",
      "selector": "BAD SELECTOR",
      "cache": false
    },
    badParse: {
      "url": "http://localhost:8889/html",
      "type": "json",
      "selector": ".query",
      "cache": false
    }
  },
  feed: {
    simple: {
      "url": "http://localhost:8889/feed",
      "type": "feed",
      "selector": ".title",
      "cache": false
    },
    noSelector: {
      "url": "http://localhost:8889/feed",
      "type": "feed",
      "cache": false
    },
    noType: {
      "url": "http://localhost:8889/feed",
      "selector": ".title",
      "cache": false
    },
    badSelector: {
      "url": "http://localhost:8889/feed",
      "type": "feed",
      "selector": "BAD SELECTOR",
      "cache": false
    },
    badParse: {
      "url": "http://localhost:8889/html",
      "type": "feed",
      "selector": ".title",
      "cache": false
    }
  },
  xml: {
    simple: {
      "url": "http://localhost:8889/xml",
      "type": "xml",
      "selector": ".CustomerName",
      "cache": false
    },
    noSelector: {
      "url": "http://localhost:8889/xml",
      "type": "xml",
      "cache": false
    },
    noType: {
      "url": "http://localhost:8889/xml",
      "selector": ".CustomerName",
      "cache": false
    },
    badSelector: {
      "url": "http://localhost:8889/xml",
      "type": "xml",
      "selector": "BAD SELECTOR",
      "cache": false
    },
    badParse: {
      "url": "http://localhost:8889/html",
      "type": "xml",
      "selector": ".CustomerName",
      "cache": false
    }
  },
  misc: {
    badUrl: {
      "url": "BAD URL",
      "cache": false
    },
    badType: {
      "url": "http://localhost:8889/html",
      "type": "BAD TYPE",
      "cache": false
    }
  },
  map: {
    simple: {
      "url": "http://localhost:8889/html",
      "type": "html",
      "map": {
        "foo": {
          "selector": "h1"
        },
        "bar": {
          "selector": "title"
        }
      },
      "cache": false
    }
  },
  post: {
    simple: {
      "url": "http://localhost:8889",
      "type": "html",
      "selector": "h1",
      "extract": "text",
      "post": {
        "foo": "bar"
      },
      "cache": false
    }
  },
  headers: {
    simple: {
      "url": "http://localhost:8889/html",
      "type": "html",
      "selector": "h1",
      "headers": ["X-Powered-By"],
      "cache": "false"
    },
    linkHeaders: {
      "url": "http://localhost:8889/html",
      "type": "html",
      "selector": "h1",
      "linkHeader": true,
      "cache": "false"
    }
  }
};

// Query answers

exports.queries.answers = {
  html: {
    simple: [
      {
        "results": ["css Zen Garden: The Beauty in CSS Design"]
      }
    ],
    noExtract: [
      {
        "results": ["css Zen Garden: The Beauty in CSS Design"]
      }
    ],
    noType: [
      {
        "results": ["css Zen Garden: The Beauty in CSS Design"]
      }
    ],
    badSelector: [
      {
        "results": [],
        "error": "Could not match with that selector or extract value"
      }
    ],
    badExtract: [
      {
        "results": [],
        "error": "Could not match with that selector or extract value"
      }
    ]
  },
  json: {
    simple: [
        {
            "results": [
                "dinosaurs"
            ]
        }
    ],
    noType: [
        {
            "results": [
                "dinosaurs"
            ]
        }
    ],
    badSelector: [
        {
            "results": [],
            "error": "Could not match with that selector"
        }
    ],
    badParse: [
        {
            "results": [],
            "error": "Could not parse JSON document"
        }
    ]
  },
  feed: {
    simple: [
        {
            "results": [
                "Atom-Powered Robots Run Amok",
                "Example Feed"
            ]
        }
    ],
    noSelector: [
        {
            "results": [
                [
                    {
                        "title": "Atom-Powered Robots Run Amok",
                        "description": "Some text.",
                        "summary": "Some text.",
                        "date": "2003-12-13T18:30:02.000Z",
                        "pubdate": "2003-12-13T18:30:02.000Z",
                        "pubDate": "2003-12-13T18:30:02.000Z",
                        "link": "http://example.org/2003/12/13/atom03",
                        "guid": "urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a",
                        "author": "John Doe",
                        "comments": null,
                        "origlink": null,
                        "image": {},
                        "source": {},
                        "categories": [],
                        "enclosures": [],
                        "atom:@": {},
                        "atom:title": {
                            "@": {},
                            "#": "Atom-Powered Robots Run Amok"
                        },
                        "atom:link": {
                            "@": {
                                "href": "http://example.org/2003/12/13/atom03"
                            }
                        },
                        "atom:id": {
                            "@": {},
                            "#": "urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a"
                        },
                        "atom:updated": {
                            "@": {},
                            "#": "2003-12-13T18:30:02Z"
                        },
                        "atom:summary": {
                            "@": {},
                            "#": "Some text."
                        },
                        "meta": {
                            "#ns": [
                                {
                                    "xmlns": "http://www.w3.org/2005/Atom"
                                }
                            ],
                            "@": [
                                {
                                    "xmlns": "http://www.w3.org/2005/Atom"
                                }
                            ],
                            "#type": "atom",
                            "#version": "1.0",
                            "title": "Example Feed",
                            "description": null,
                            "date": "2003-12-13T18:30:02.000Z",
                            "pubdate": "2003-12-13T18:30:02.000Z",
                            "pubDate": "2003-12-13T18:30:02.000Z",
                            "link": "http://example.org/",
                            "xmlurl": null,
                            "xmlUrl": null,
                            "author": "John Doe",
                            "language": null,
                            "favicon": null,
                            "copyright": null,
                            "generator": null,
                            "image": {},
                            "categories": [],
                            "atom:@": {
                                "xmlns": "http://www.w3.org/2005/Atom"
                            },
                            "atom:title": {
                                "@": {},
                                "#": "Example Feed"
                            },
                            "atom:link": {
                                "@": {
                                    "href": "http://example.org/"
                                }
                            },
                            "atom:updated": {
                                "@": {},
                                "#": "2003-12-13T18:30:02Z"
                            },
                            "atom:author": {
                                "@": {},
                                "name": {
                                    "@": {},
                                    "#": "John Doe"
                                }
                            },
                            "atom:id": {
                                "@": {},
                                "#": "urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6"
                            }
                        }
                    }
                ]
            ]
        }
    ],
    noType: [
        {
            "results": [
                "Atom-Powered Robots Run Amok",
                "Example Feed"
            ]
        }
    ],
    badSelector: [
        {
            "results": [],
            "error": "Could not match with that selector"
        }
    ],
    badParse: [
        {
            "results": [],
            "error": "The provided document couldn't be normalised"
        }
    ]
  },
  xml: {
    simple: [
        {
            "results": [
                "Acme Alpha"
            ]
        }
    ],
    noSelector: [
        {
            "results": [
                {
                    "Order": {
                        "Date": "2003/07/04",
                        "CustomerId": 123,
                        "CustomerName": "Acme Alpha",
                        "Item": [
                            {
                                "ItemId": 987,
                                "ItemName": "Coupler",
                                "Quantity": 5
                            },
                            {
                                "ItemId": 654,
                                "ItemName": "Connector",
                                "Quantity": {
                                    "unit": 12,
                                    "$t": 3
                                }
                            },
                            {
                                "ItemId": 579,
                                "ItemName": "Clasp",
                                "Quantity": 1
                            }
                        ]
                    }
                }
            ]
        }
    ],
    noType: [
        {
            "results": [
                "Acme Alpha"
            ]
        }
    ],
    badSelector: [
        {
            "results": [],
            "error": "Could not match with that selector"
        }
    ],
    badParse: [
        {
            "results": [],
            "error": "Could not parse XML to JSON"
        }
    ]
  },
  misc: {
    badUrl: [
        {
            "results": [],
            "error": "Document not found"
        }
    ],
    badType: [
        {
            "results": [],
            "error": "Document type not supported"
        }
    ]
  },
  map : {
    simple: [
        {
            "results": {
                "bar": ["css Zen Garden: The Beauty in CSS Design"],
                "foo": ["css Zen Garden"]
            }
        }
    ]
  },
  post: {
    simple: [
      {
        "results": ["was posted"]
      }
    ]
  },
  headers: {
    simple: [
        {
            "results": ["css Zen Garden"],
            "headers": {
                "X-Powered-By": "Noodle testing server"
            }
        }
    ],
    linkHeaders: [
        {
            "results": ["css Zen Garden"],
            "headers": {
                "link": {
                    "next": "foo",
                    "last": "bar"
                }
            }
        }
    ]
  }
};