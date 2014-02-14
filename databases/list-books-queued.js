'use strict'; 

const
  async = require('async'),
  file = require('file'),
  rdfParser = require('./lib/rdf-parser.js'),
  concurrency = process.argv[2] || 100,

  work = async.queue(afterQueue, concurrency);

function afterQueue(path, done) {
  rdfParser(path, function(err, doc) {
    console.log(doc);
    done();
  });
};

console.log('concurrency: ' + concurrency);

console.log('beginning directory walk');
file.walk(__dirname + '/cache', afterWalk);

function afterWalk(err, dirPath, dirs, files) {
  files.forEach(function(path) {
    work.push(path);
  });
};

// node --harmony list-books-queued.js

