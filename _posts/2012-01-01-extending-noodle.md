---
category: reference
heading: Extending noodle
---

More noodle types can be supported by adding the name of the type in 
`node_modules/noodle/lib/types/`.

For example `node_modules/noodle/lib/types/csv.js`.

A type should expose an `_init` function which accepts the main `noodle` option 
as the parameter. You should keep hold of this reference so you can make use of 
the result cache.

A type should expose at least a fetch method with the following signature and 
should return a promise which resolves with the results.

`exports.fetch = function (url, query)`

Within that it is recommended you use the core `noodle.fetch` to get your page 
so its cached.

It is also recommended you expose your query algorithm to allow other developers 
have access to it. However this is not necessary.

In your algorithm do not account for multiple queries. Types are iterated over 
by the noodle server middleware.

`exports.select = function (page, query)`

An example implementation could look like this:

    var q = require('q'),
        noodle ;

    exports._init = function (n) {
      noodle = n;
    }

    exports.fetch = function (url, query) {
      return noodle.fetch(url).then(function (page) {
        return exports.select(page, query);
      });
    }

    exports.select = function (page, query) {
      var deferred = q.Defer();

      /* 
        your algorithm here, dont forget to
        deferred.resolve(result) and/or 
        deferred.fail(new Error("Selector was bad"))
      */

      return deferred.promise;
    }