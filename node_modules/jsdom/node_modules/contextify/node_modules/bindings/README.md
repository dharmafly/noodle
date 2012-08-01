node-bindings
=============
### Helper module for loading your native module's bindings

This is a helper module for authors of Node.js native addon modules. In node >=
0.7.0, it is encouraged to statically precompile your native addons for your
various supported platforms and architectures, rather than depend on your users
to do that. This adds two new burdens on the developer that we now need to
consider while writing our module:

 1. You now have to compile the bindings yourself, before publishing the module.
 2. You now have to figure out which version of the bindings to load at runtime.

`node-bindings` attempts to solve probelm `#2`.

This module solves the organizational problem of how to store these bindings
files with a simple directory convention:

```
<module_root>/compiled/<node_version>/<platform>/<arch>/bindings.node
```

So for example, on a 32-bit Windows platform, running node `v0.6.9`, the
`bindings.node` file should be placed in:

```
<module_root>/compiled/0.6/win32/ia32/bindings.node
```

On 64-bit Mac OS X, running node `v0.7.1`, then the bindings file should be
placed in:

```
<module_root>/compiled/0.7/darwin/x64/bindings.node
```

For reference, the calculations for the various parts that makes up the require
path are:

 * `<module_root>` - The directory where `package.json` is found is the root.
 * `<platform>` - `process.platform`
 * `<arch>` - `process.arch`
 * `<node_version>` - `parseFloat(process.versions.node)`

The default "compiled" directory is `compiled` and the default name of every
"bindings" file is `bindings.node`. This is configurable if you'd like.


Installation
------------

Install with `npm`:

``` bash
$ npm install bindings
```


Example
-------

`require()`ing the proper bindings file for the current node version, platform
and architecture is as simple as:

``` js
var bindings = require('bindings')()

// Use your bindings defined in your C files
bindings.your_c_function()
```

You can specify the name of the bindings file if you desire:

``` js
var bindings = require('bindings')('my_bindings')
```

Or you can pass in an options Object for full configuration:


``` js
var bindings = require('bindings')({
    bindings: 'my_bindings'
  , compiled: 'builddir'
})
```

Nice Error Output
-----------------

```
Error: Could not load the bindings file. Tried:
 -> /Users/nrajlich/node-ffi/out/Debug/ffi_bindings.node
 -> /Users/nrajlich/node-ffi/Debug/ffi_bindings.node
 -> /Users/nrajlich/node-ffi/out/Release/ffi_bindings.node
 -> /Users/nrajlich/node-ffi/Release/ffi_bindings.node
 -> /Users/nrajlich/node-ffi/compiled/0.6/darwin/x64/ffi_bindings.node
 -> /Users/nrajlich/node-ffi/build/Release/ffi_bindings.node
 -> /Users/nrajlich/node-ffi/build/default/ffi_bindings.node
    at bindings (/Users/nrajlich/node-ffi/node_modules/bindings/bindings.js:80:13)
    at Object.<anonymous> (/Users/nrajlich/node-ffi/lib/ffi.js:3:34)
    at Module._compile (module.js:441:26)
    at Object..js (module.js:459:10)
    at Module.load (module.js:348:31)
    at Function._load (module.js:308:12)
    ...
```

License
-------

(The MIT License)

Copyright (c) 2012 Nathan Rajlich &lt;nathan@tootallnate.net&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
