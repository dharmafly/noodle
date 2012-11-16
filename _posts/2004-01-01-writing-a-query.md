---
category: reference
heading: Writing a Query
---

A simple query looks like this:

    {
      "url": "http://chrisnewtn.com",
      "selector": "ul.social li a",
      "extract": "href",
      "type": "html"
    }

The `type` property is used to tell noodle if you are wanting to scrape a html 
page, json document etc. If no type is specified then a html page will be 
assumed by default.

A similar query can be constructed to extract information from a JSON document.
JSONSelect is used as the underlying library to do this. It supports common CSS3 
selector functionality. You can [familiarize yourself with it here.](http://jsonselect.org/#tryit)

    {
      "url": "https://search.twitter.com/search.json?q=friendship",
      "selector": ".results .from_user",
      "type": "json"
    }

An `extract` property is not needed for a query on JSON documents.

## Document types and selector usage

Different document types need a different type of selector to be used.

- `html` requires the use of standard css dom selectors
- `json` requires the use of JSONSelect style selectors
- `feed` requires the use of JSONSelect style selectors
- `xml`  requires the use of JSONSelect style selectors