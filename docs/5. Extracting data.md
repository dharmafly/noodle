---
category: reference
---

The `extract` property could be the HTML element's attribute.

Having `"html"` or `"innerHTML"` as the `extract` value will return the
containing HTML within that element.

Having `"text"` as the `extract` value will return only the text. nsql will 
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