---
category: reference
heading: Extra query configuration
---

**Posting data**

noodle allows for post data to be passed along to the target web server 
specified in the url. This can be optionally done with the `post` property 
which takes an object map of the post data key/values.

    {
      "url": "http://example.com/login.php",
      "post": {
        "username": "john",
        "password": "123"
      },
      "select": "h1.username",
      "type": "html"
    }

**Do not cache**

If set `cache` to `false` in your query then noodle will not cache the results 
or associated page and it will get the data fresh. This is useful for debugging.

    {
      "url": "http://example.com",
      "selector": "h1",
      "cache": "false"
    }
  