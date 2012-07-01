node-scrape-query-language
==========================

nsql can be used to scrape pages from a client side browser. It uses the standard 
DOM query selector to extract information from web pages and returns the data in JSON 
format.

You just specify the source `url`, the `selector`, and what you want to `extract`.

Getting started
---------------

`git clone https://github.com/dharmafly/nsql.git`  
`cd nsql`  
`npm install`  
`node app.js`  

Usage
-----

Send the following command to the server. The `extract` property should be the HTML 
element's attribute. 

Having `"html"` or `"innerHTML"` as the `extract` value will return the containing 
HTML within that element.

Having `"text"` as the `extract` value will return only the text.

```JSON
{
  "url": "http://chrisnewtn.com",
  "selector": "ul.social li a",
  "extract": "href"
}
```

To retrieve the following data:

```JSON
{
 "href": [
   "http://twitter.com/chrisnewtn",
   "http://plus.google.com/u/0/111845796843095584341",
   "http://github.com/chrisnewtn",
   "http://lanyrd.com/profile/chrisnewtn/"
 ]
}
```

Multiple extract rules
----------------------

It is also possible to request multiple properties to extract in one query by using 
an array.

```JSON
{
  "url": "http://chrisnewtn.com",
  "selector": "ul.social li a",
  "extract": ["href", "text"]
}
```

and you will recieve the following data:

```JSON
{
  "href" : [
   "http://twitter.com/chrisnewtn",
   "http://plus.google.com/u/0/111845796843095584341",
   "http://github.com/chrisnewtn",
   "http://lanyrd.com/profile/chrisnewtn/"
  ],
  "text": [
    "twitter",
    "google",
    "github",
    "lanyrd"
  ]
}
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

```JSON
{
  "text": [
      "Twitter",
      "Google+",
      "Github",
      "Lanyrd"
  ],
  "nonexistent": []  
}
```
