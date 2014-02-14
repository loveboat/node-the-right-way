#!/usr/bin/env node --harmony

const
request = require('request'),
options = {
  method: process.argv[2] || 'GET',
  url: 'http://localhost:5984/' + (process.argv[3] || '')
};

request(options, function(err, res, body) {
  if (err) {
    throw Error(err);
  } else {
    console.log(res.statusCode, JSON.parse(body));
  }
});

// make executable
// chmod +x dgcli.js

// use
// ./dbcli.js

// 404 - no books db
// ./dbcli.js GET books

// creates a books db at /books (see diff with POST)
// ./dbcli.js PUT books

// 200 - books db status returned
// ./dbcli.js GET books
