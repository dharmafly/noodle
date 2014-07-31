[noodle](http://noodlejs.com) 
=============================

noodle is a Node.js server and module for querying and scraping data from web documents. It features:

```JSON
{
  "url": "https://github.com/explore",
  "selector": "ol.ranked-repositories h3 a",
  "extract": "href"
}
```

Features
--------

- Cross domain document querying (html, json, xml, atom, rss feeds)
- Server supports querying via JSONP and JSON POST
- Multiple queries per request
- Access to queried server headers
- Allows for POSTing to web documents
- In memory caching for query results and web documents

Server quick start
------------------

Setup

    $ npm install noodlejs

or

    $ git clone git@github.com:dharmafly/noodle.git
    $ cd noodle
    $ npm install

Start the server by running the binary

    $ bin/noodle-server
    Noodle node server started
    ├ process title  node-noodle
    ├ process pid    4739
    └ server port    8888


You may specify a port number as an argument

    $ bin/noodle-server 9090
    Noodle node server started
    ├ process title  node-noodle
    ├ process pid    4739
    └ server port    9090


Noodle as a node module
-----------------------

If you are interested in the node module just run ```npm install noodlejs```,
require it and check out the [noodle api](http://noodlejs.com/reference/#noodle-as-node-module)  

```javascript
var noodle = require('noodlejs');

noodle.query({
  url:      'https://github.com/explore',
  selector: 'ol.ranked-repositories h3 a',
  extract:  'href'
})
.then(function (results) {
  console.log(results);
});
```

Tests
-----

The noodle tests create a temporary server on port `8889` which the automated 
tests tell noodle to query against. 

To run tests you can use the provided binary *from the noodle package 
root directory*:

    $ cd noodle
    $ bin/tests

Contribute
----------

Contributors and suggestions welcomed.

- [http://noodlejs.com](http://noodlejs.com)  
- [https://github.com/dharmafly/noodle](https://github.com/dharmafly/noodle)  
