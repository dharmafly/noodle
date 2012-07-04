node-scrape-query-language
==========================

nsql is a server which can be used to scrape pages from the client side browser.
It uses the jQuery query selector to extract information from web pages and
returns the data in JSON. The server also supports JSONP (?callback=foo) format
for making calls.

In your calls to the server your just specify the source `url`, the `selector`,
and what you want to `extract`.

Getting started
---------------

Setup

    $ git clone https://github.com/dharmafly/nsql.git
    $ cd nsql
    $ npm install

Then run the binary

    $ bin/nsql-server
     Server running on port 8888

You may specify a port number as a command line argument

    $ bin/nsql-server 9090
     Server running on port 9090

Usage
-----

One can send the following JSON command to the server.

```JSON
{
  "url": "http://chrisnewtn.com",
  "selector": "ul.social li a",
  "extract": "href"
}
```

The `extract` property could be the HTML element's attribute.

Having `"html"` or `"innerHTML"` as the `extract` value will return the
containing HTML within that element.

Having `"text"` as the `extract` value will return only the text.

Return data looks like this:

```JSON
[
  {
    "href": "http://twitter.com/chrisnewtn"
  },
  {
    "href": http://plus.google.com/u/0/111845796843095584341"
  },
  {
    "href": http://github.com/chrisnewtn"
  },
  {
    "href": http://lanyrd.com/profile/chrisnewtn/"
  }
]
```

Multiple extract rules
----------------------

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
[
  {
    "href" : "http://twitter.com/chrisnewtn",
    "text" : "twitter"
  },
  {
   "href" : "http://plus.google.com/u/0/111845796843095584341",
   "text" : "google"
  },
  {
   "href" : "http://github.com/chrisnewtn",
   "text" : "github"
  },
  {
    "href" : "http://lanyrd.com/profile/chrisnewtn/",
    "text" : "lanyrd"
  }
]
```

Errors
------

nsql fails silently and assumes error handling to be handled by the client side.
Consider the following JSON response to a partially incorrect query.

Query:

```JSON
{
  "url": "http://chrisnewtn.com",
  "selector": "ul.social li a",
  "extract": ["text", "nonexistent"]
}
```

Response:

Not how the extract "nonexistent" property is left out because it was not found
on the element.

```JSON
[
  {
    "href" : "twitter",
  },
  {
    "href" : "google",
  },
  {
    "href" : "github",
  },
  {
    "href" : "lanyrd",
  }
]
```

If the selector is invalid or none of the extract rules match up then you will receive
an empty array.

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
[]
```