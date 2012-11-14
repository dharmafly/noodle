noodle 
======

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
- In memory caching

Getting started
---------------

Setup

    $ git clone https://github.com/dharmafly/noodle.git
    $ cd noodle
    $ npm install

Start the server by running the binary

    $ bin/noodle-server
     Server running on port 8888

You may specify a port number as a command line argument

    $ bin/noodle-server 9090
     Server running on port 9090

Or if you are interested in the node module just require it and 
consult the [noodle api]();

`var noodle = require('noodle')`

Learn noodle
------------

You can understand noodle fully at [http://noodlejs.com/](http://noodlejs.com/).