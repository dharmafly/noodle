noodle :ramen: 
======

noodle is a server which can be queried to scrape pages from a client side 
browser. It uses the jQuery query selector or 
[JSONSelect](http://jsonselect.org/#tryit) to extract information from web 
pages and returns the data in JSON. The server supports JSONP (?callback=foo) 
and POST.

In your call to the server you just specify your query(s) and recieve your data 
back in JSON.

noodle can also be used as a 
[simple npm module](https://github.com/dharmafly/noodle#noodle-as-an-npm-module).

Features
--------------

- Cross domain DOM or JSON document querying
- Supports querying via JSONP and JSON POST
- Multiple queries can be made per request
- In memory caching

[Try it out!](http://dharmafly.github.com/noodle/#try-it-out)

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

Usage
-----

The server can accept scraping queries in 2 ways:

### with JSONP

You can send a URI encoded blob of json for the `q` querystring key.

`http://dharmafly.nsql-example.com?q=<JSONBLOB>&callback=?`

If you are unable to stringify JSON you can still use the querystring to make 
one query (but not multiple).

```JavaScript
jQuery.param(query);
// eg. url=http%3A%2F%2Fchrisnewtn.com&selector=ul.social+li+a&extract%5B%5D=text&extract%5B%5D=href
```

### with POST

You can also POST your query as json (`application/json`) to the noodle server. 
This is preferable if your request is too large or you're talking to noodle from 
another server. However the browser [may not cache](http://stackoverflow.com/questions/626057/is-it-possible-to-cache-post-methods-in-http) these requests.

### Writing a query

A simple query to a DOM document looks like this:

```JSON
{
  "url": "http://chrisnewtn.com",
  "selector": "ul.social li a",
  "extract": "href",
  "type": "html"
}
```

The `type` property is used to tell noodle if you are wanting to scrape a html 
page or a json document. If no type is specified then a html page will be 
assumed.

A similar query can be constructed to extract information from a JSON document.
JSONSelect is used as the underlying library to do this. It supports common CSS3 
selector functionality. You can [familiarize yourself with it here.](http://jsonselect.org/#tryit)

```JSON
{
  "url": "https://search.twitter.com/search.json?q=friendship",
  "selector": ".results .from_user",
  "type": "json"
}
```

An `extract` property is not needed for a query on JSON documents.

#### Extracting data

The `extract` property could be the HTML element's attribute. This property 
should be ommitted when selecting from a JSON Document as the node value is 
always assumed.

Having `"html"` or `"innerHTML"` as the `extract` value will return the
containing HTML within that element.

Having `"text"` as the `extract` value will return only the text. noodle will 
strip out any new line characters found in the text.

Return data looks like this:

```JSON
{
    "results": [
        {
            "href": "http://twitter.com/chrisnewtn"
        },
        {
            "href": "http://plus.google.com/u/0/111845796843095584341"
        }
    ],
    "created": "2012-08-01T16:22:14.705Z"
}
```

Having no specific extract rule will assume a default of extracting `"html"` 
from the `selector`.

##### Getting full JSON or HTML documents

If no `selector` is specified than the entire document is returned. The 
`extract` rule will be ignored if included.

Query:

```JSON
{
  "url": "https://search.twitter.com/search.json?q=friendship"
}
```

Response:

```JSON
{
  "results": ["<full document contents>"],
  "created": "2012-10-24T15:37:29.796Z"
}
```

#### Multiple extract rules

It is also possible to request multiple properties to extract in one query via
array.

Query:

```JSON
{
  "url": "http://chrisnewtn.com",
  "selector": "ul.social li a",
  "extract": ["href", "text"]
}
```

Response:

```JSON
{
    "results": [
        {
            "href": "http://twitter.com/chrisnewtn",
            "text": "Twitter"
        },
        {
            "href": "http://plus.google.com/u/0/111845796843095584341",
            "text": "Google+"
        }
    ],
    "created": "2012-08-01T16:23:41.913Z"
}
```

#### Multiple queries per request

Multiple queries can be made per request to the server. You can mix between 
both `html` type queries or `json` type queries in the same request.

noodle will respond in an array if you send your queries as an array.

Query:

```JSON
[
  {
    "url": "http://chrisnewtn.com",
    "selector": "ul.social li a",
    "extract": ["text", "href"]
  },
  {
    "url": "http://premasagar.com",
    "selector": "#social_networks li a.url",
    "extract": "href"
  }
]
```

Response:

```JSON
[
    {
        "results": [
            {
                "href": "http://twitter.com/chrisnewtn",
                "text": "Twitter"
            },
            {
                "href": "http://plus.google.com/u/0/111845796843095584341",
                "text": "Google+"
            }
        ],
        "created": "2012-08-01T16:23:41.913Z"
    },
    {
        "results": [
            {
                "href": "http://dharmafly.com/blog"
            },
            {
                "href": "http://twitter.com/premasagar"
            }
        ],
        "created": "2012-08-01T16:22:13.339Z"
    }
]
```

### Errors

noodle aims to give errors for the possible use cases were a query does 
not yield any results.

Each error is specific to one result object and are contained in the `error` 
property as a string message.

Response:

```JSON
{
        "results": [],
        "error": "Page not found"
}
```

**Caught errors**

- `'Page not found'` &mdash; when the provided url does not lead to a resource.
- `'Could not match with that selector'` &mdash; when the selector is left empty 
or the results of the selector yield an empty array.
- `'Invalid query type'` &mdash; when the query type specified is a document 
format which noodle doesn't support.
- `'Could not parse JSON document'` &mdash; when the query type is specified as 
`'json'` but the url provided does not point to a valid JSON document.

noodle also falls silently with the `'extract'` property by ommitting any 
extract results from the results object.

Consider the following JSON response to a partially incorrect query.

Query:

```JSON
{
  "url": "http://chrisnewtn.com",
  "selector": "ul.social li a",
  "extract": ["href", "nonexistent"]
}
```

Response:

The extract "nonexistent" property is left out because it was not found
on the element.

```JSON
{
    "results": [
        {
            "href": "http://twitter.com/chrisnewtn"
        },
        {
            "href": "http://plus.google.com/u/0/111845796843095584341"
        }
    ],
    "created": "2012-08-01T16:28:19.167Z"
}
```

If the selector is invalid or none of the extract rules match up then you 
will receive an empty array.

Query:

```JSON
{
  "url": "http://chrisnewtn.com",
  "selector": "ul.social li a",
  "extract": ["nonexistent", "nonexistent2"]
}
```

Response:

```JSON
{
    "results": [],
    "created": "2012-08-01T16:26:39.734Z"
}
```

### Caching

Caching is done on a singular query basis and not per request. An individual 
query is cleared every hour. The cache itself has a total size of 124 (default) 
recorded queries and associated results in memory. 

The entire cache is cleared on a weekly basis by default.

All the mentioned time values can be changed in `lib/config.js`.

If a result object has a `created` field this signifies that it has been cached.
Failed queries such from 404 errors will not be cached.

Take not however that the browser [may not cache](http://stackoverflow.com/questions/626057/is-it-possible-to-cache-post-methods-in-http) POST requests to the noodle 
server.

#### HTTP caching headers

The `Expires` header is set to the oldest to expire query in a result set.


noodle as an npm module
-----------------------

The main entry point to noodle's functionality is the `scrape` method. The 
query parameter can be a query represented as an object literal or an array 
of queries.

```JavaScript
var noodle = require('noodle');

noodle.scrape(query, function (err, results) {
  if (!err) {
    console.log(results);
  } else {
    console.log(err);
  }
});
```
