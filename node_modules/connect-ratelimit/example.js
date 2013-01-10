var connect  = require('connect'),
    http     = require('http'),
    limiter  = require('./index'),
    app      = connect()
                .use(limiter({
                  whitelist: ['127.0.0.1'],
                  blacklist: ['example.com']
                }))
                .use(function (req, res) {
                  res.end('Hello world!');
                });

http.createServer(app).listen(3000, function () {
  console.log('Example server on ' + 3000);
});