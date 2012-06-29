node-scrape-query-language
==========================

nsql can be used to scrape pages from a client side browser. It uses the standard 
DOM query selector to extract information from web pages and returns the data in JSON 
format.

You just specify the source `url`, the `selector`, and what you want to `extract`.

If no `extract` is specified the DOM list will be returned instead.

Usage
-----

Send the following command to the server. The `extract` property should be the HTML's 
attribute. Having `html` as the 'extract' value will return the containing HTML.

```
{
  source: 'http://chrisnewtn.com',
  selector: 'ul.social li a',
  extract: 'href'
}
```

To retrieve the following data:

```
 [
   "http://twitter.com/chrisnewtn",
   "http://plus.google.com/u/0/111845796843095584341",
   "http://github.com/chrisnewtn",
   "http://lanyrd.com/profile/chrisnewtn/"
 ]
```
