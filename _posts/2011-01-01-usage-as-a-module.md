---
category: reference
heading: Usage as a module
---

The main entry point to noodle's functionality is the `query` method. This 
method accepts a query or an array of queries as its only parameter and returns 
a [promise](https://github.com/kriskowal/q). 

    var noodle = require('noodle');
    noodle.query(queries).then(function (results) {
      console.log(results);
    });

The makeup of query(s) is analagous to using noodle as a web service (as 
[stated above](http://noodlejs.com/reference/#writing-a-query)). The 
exception being that you supply a proper object and not JSON.

For more programmability one can utilise the `fetch` method of the various 
supported document type namespaces. These namespaces follow:

    var noodle = require('noodle');

    noodle.html;
    noodle.feed;
    noodle.json;
    noodle.xml;

The `fetch` method returns a [promise object](https://github.com/kriskowal/q).

    var noodle = require('noodle');

    noodle.html.fetch(url, query).then(function (results) {
      console.log(results);
    })

The api also exposes lower level methods which the `fetch` methods use. These 
low level methods all return [promises](https://github.com/kriskowal/q).

**noodle.fetch**

Calling `noodle.fetch` from the noodle namespace and not the type namespace is 
different. Instead it is used for simply retrieving a web document.


    noodle.fetch(url).then(function (page) {
      console.log(page);
    });


**noodle.html.select**

For applying one query to a html string and retrieving the results.

    noodle.html.select(html, {selector: 'title', extract: 'innerHTML'})
    .then(function (result) {
      console.log(result);
    });


**noodle.json.select**

For applying one query to a parsed JSON representation (object).

    var parsed = JSON.parse(json);
    noodle.html.select(parsed, {selector: '.name'})
    .then(function (result) {
      console.log(result);
    });

**noodle.xml.select**

Proxies to `noodle.json.select`.

**noodle.feed.select**

Normalises an RSS, ATOM or RDF string with 
[node-feedparser](https://github.com/danmactough/node-feedparser) then proxies 
that normalised object to `noodle.json.select`.

### noodle events

noodle's `noodle.events` namespace allows one to listen for emitted cache 
related events. Noodle inherits from node's [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).

  // Called when a page is cached
  noodle.events.on('cache/page', function (obj) {
    //obj is the page cache object detailing the page, its headers 
    //and when it was first cached
  });

  // Called when a result is cached
  noodle.events.on('cache/result', function (obj) {
    //obj is the result cache object detailing the result and when
    //it was first cached
  });

  // Called when the cache is purged
  noodle.events.on('cache/purge', function (arg1, arg2) {
    //arg1 is a javascript date representing when the cache was purged
    //arg2 is the time in milliseconds until the next cache purge
  });

  // Called when a cached item has expired from the cache
  noodle.events.on('cache/expire', function (obj) {
    //obj is the cache item
  }); 

### Configuration

Configuration is possible programmatically via `noodle.configure(obj)`.

This accepts an object which is partly or fully representing the config optins.
This object is applied over the existing config found in the `config.json`.

Example to change just 2 settings:

    var noodle = require('noodle');

    noodle.configure({
      debug: false,
      defaultDocumentType: "json"
    });

### Error handling

Noodle will fire various errors which one can listen for with the `fail()` 
handler.

    noodle.html.fetch(query)
    .then(function (result) {
      console.log('The results are', results);
    })
    .fail(function (error) {
      console.log('Uh oh, ' error.message);
    });

#### Possible errors

The noodle module itself emits only one error:

- `"Document not found"` when a targetted url is not found.

Were as the specific document type modules emit their own:

- `'Could not parse XML to JSON'`
- `'Could not parse JSON document'`
- `'Could not match with that selector'`
- `'Could not match with that selector or extract value'`
