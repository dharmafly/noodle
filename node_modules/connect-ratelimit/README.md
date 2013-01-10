connect-ratelimit
=================

```JavaScript
var limiter = require('connect-ratelimit');

app = connect()
      .use(limiter({
        whitelist: ['127.0.0.1'],
        blacklist: ['example.com']
      }))
      .use(function (req, res) {
        res.end('Hello world!');
      });
```

connect-ratelimit is connect middleware for limiting the number of requests per 
client ip/hostname to your node server.

When a limit is reached the middleware will cancel the middleware chain early 
with `res.end('Rate limit exceeded.')` or you can optionally check for a limit 
exceeding yourself elsewhere down the chain.

About
-----

### Catagories

Catagories serve as templates to manage different types of connecting clients.
By default all clients are catagorized as 'normal' but `whitelist` and `blacklist` 
catagories also exist. 

#### normal

By default anyone uncatagorized will be subject to 500 requests per hour.

#### whitelist

By default client names in the whitelist will be subject to 4000 requests per 
hour.

#### blacklist

By default client names in the blacklist will be subject to 0 requests per 0 
time. In other words they will always be exceding the rate limit.

### Client identification

connect-ratelimit uses the following code to identify clients:

```JavaScript
req.headers['x-forwarded-for'] || req.connection.remoteAddress
```


Usage
-----

```JavaScript
var limiter = require('connect-ratelimit');
```

The middleware takes an options object with the following parameters:

- `whitelist`: An array of strings representing clients you wish to apply to 
the whitelist catagory. eg. `['127.0.0.1']` for local development.
- `blacklist`: An array of strings representing clients you wish to apply to 
the blacklist catagory.
- `end`: A boolean when set to false (default true) the connect chain will 
continue even if a client has exceeded the ratelimit. The `response` object is 
augmented with the `ratelimit` namespace. `response.ratelimit` exposes an object 
which contains the various details about the client including if they have past 
their limit as well as all other recorded clients. This is useful if you wish 
to supply your own error response to the client or any other logic.
- `catagories`: An object representing the various *total requests* per *time* 
for each catagory type. See below.

### Configuring the different catagories

The `catagories` property of the options object for the connect-limiter allows 
you to specify different `totalRequests` and `every` for specific catagories.

A fully configured value of the `catagories` property could like this:

```JavaScript
{
  whitelist: {
    totalRequests: 5000,
    every:         60 * 1000 * 1000
  },
  blacklist: {
    totalRequests: 0,
    every:         0 
  },
  normal: {
    totalRequests: 5,
    every:         60 * 1000 * 1000
  }
}
```

Set `totalRequests` to `0` is how to block requests from under catagory 
entirely.

Below is how you can switch from an hourly rate to a half-hourly rate for all 
catagories but blacklist.

```JavaScript
.use(limiter({
  whitelist: ['dharmafly.com'],
  catagories: {
    normal: {
      every: (60 * 1000 * 1000) / 2
    },
    whitelist: {
      every: (60 * 1000 * 1000) / 2
    }
  }
}))
```

You don't need to set every catagory, just the properties you want to change.

Example
-------

connect is required for the example to run.

```bash
npm install connect
```

To play with the example app run the command below and navigate to 
[localhost:4000](http://localhost:4000)

```bash
node example.js
```
