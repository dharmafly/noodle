var connect = require('connect'),
    http    = require('http'),
    scraper = require('./scraper');

var app = connect()
          .use(connect.static('public'))
          .use(connect.json())
          .use(handle);

function handle (req, res) {
  var query = (Object.keys(req.body).length > 0) ?  req.body : false;
  console.log(req.body, query);
  if (query) {
    scraper.scrape(query, function (err, results) {
      finish(res, {error: err, results: results});
    });
  } else {
    finish(res, {error: 'No query'});
  }
}

function finish (res, params) {
  if (params.error) {
    res.end('nsql: ' + params.error);
  } else {
    res.writeHead('200', {'Content-type':'application/json'});
    res.end(params.results);
  }
}

http.createServer(app).listen(8888);