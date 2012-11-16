---
category: reference
heading: Multiple queries per request
---

Multiple queries can be made per request to the server. You can mix between 
different types of queries in the same request.

Query:

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

Response:

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