[noodle](http://noodlejs.com) 
=============================

noodle is a server and node module which individuals can use to query data from 
web documents like html, json and xml feeds.

```JSON
{
  "url":"https://github.com/explore",
  "selector":"ol.ranked-repositories h3",
  "extract": "text"
}
```

Features
--------

- Cross domain document querying (html, json, xml feeds)
- Server supports querying via JSONP and JSON POST
- Multiple queries per request
- Access to queried server headers
- Allows for POSTing to scrape url
- In memory caching

[http://noodlejs.com/](http://noodlejs.com/).

Server quick start
------------------

Setup

    $ git clone https://github.com/dharmafly/noodle.git
    $ cd noodle
    $ npm install

or

    $ npm install noodle

Start the server by running the binary

    $ bin/noodle-server
     Server running on port 8888

You may specify a port number as a second argument

    $ bin/noodle-server 9090
     Server running on port 9090

Noodle as a node module
-----------------------

If you are interested in the node module just require it and check out the 
[noodle api](http://noodlejs.com/reference/#usage-as-a-module)  

`var noodle = require('noodle')`

Tests
-----

The noodle tests create a temporary server on port 8889 which the automated 
tests tell noodle to query against. 

To run tests you can use the provided binary *from the noodle package 
root directory*:

    $ bin/tests

Assuming you have mocha installed globally (`npm install mocha -g`). You can 
use mocha to run the tests files directly.

    $ mocha tests/tests.js

If you don't want to install mocha globally it is provided to you in noodle's
`node_modules` directory:

    $ node_modules/mocha/bin/mocha tests/tests.js
