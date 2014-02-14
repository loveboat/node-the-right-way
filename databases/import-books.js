'use strict'; 

const
  async = require('async'),
  file = require('file'),
  request = require('request'),
  rdfParser = require('./lib/rdf-parser.js'),
  concurrency = process.argv[2] || 100,

  work = async.queue(afterQueue, concurrency);

function afterQueue(path, done) {
  rdfParser(path, function(err, doc) {
    request({
      method: 'PUT',
      url: 'http://localhost:5984/books/' + doc._id,
      json: doc
    }, function(err, res, body) {
      if (err) {
        throw Error(err);
      }
      console.log(res.statusCode, body);
      done();
    });
  });
};

console.log('beginning directory walk');
file.walk(__dirname + '/cache', afterWalk);

function afterWalk(err, dirPath, dirs, files) {
  files.forEach(function(path) {
    work.push(path);
  });
};

// node --harmony import-books.js



