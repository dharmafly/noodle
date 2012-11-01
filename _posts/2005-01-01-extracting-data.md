--- 
heading: Extracting data
category: reference
---

The `extract` property could be the HTML element's attribute. This property 
should be ommitted when selecting from a JSON Document as the node value is 
always assumed.

Having `"html"` or `"innerHTML"` as the `extract` value will return the
containing HTML within that element.

Having `"text"` as the `extract` value will return only the text. noodle will 
strip out any new line characters found in the text.

Return data looks like this:

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

Having no specific extract rule will assume a default of extracting `"html"` 
from the `selector`.

## Getting full JSON or HTML documents

If no `selector` is specified than the entire document is returned. The 
`extract` rule will be ignored if included.

Query:

    {
      "url": "https://search.twitter.com/search.json?q=friendship"
    }

Response:

    {
      "results": ["<full document contents>"],
      "created": "2012-10-24T15:37:29.796Z"
    }