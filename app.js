var connect = require('connect'),
    http    = require('http'),
    scraper = require('./scraper'),

    port    = process.argv[2] || 8888,

    app     = connect()
              .use(connect.query())
              .use(connect.json())
              .use(handle);


// Handle requested query via scraper module

function handle (req, res) {
  var query = (Object.keys(req.body).length > 0) ?  req.body : false;
  console.log('req.query:', req.query);
  if (query) {
    scraper.scrape(query, function (err, results) {
      finish(res, {error: err, results: results, callback: req.query.callback});
    });
  } else {
    finish(res, {error: 'No query'});
  }
}

// Finish request by handling for JSONP

function finish (res, params) {
  if (params.error) {
    res.end('nsql: ' + params.error);
  } else {
    res.writeHead('200', {'Content-type':'application/json'});
    if (params.callback) {
      res.end(params.callback + '(' + params.results + ')');
    } else {
      res.end(params.results);
    }
  }
}


http.createServer(app).listen(port, function () {
  console.log('nsql serving on ' + port);
});