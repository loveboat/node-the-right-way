'use strict';

const
fs = require('fs'),
zmq = require('zmq'),

// create publisher endpoint
publisher = zmq.socket('pub'),
filename = process.argv[2];

fs.watch(filename, function() {
	// send message to any subscribers
	publisher.send(JSON.stringify({
		type: 'changed',
		file: filename,
		timestamp: Date.now()
	}));
});

// listed on port 5432
publisher.bind('tcp://*:5432', function(err) {
	console.log('Listening for zmq subscribers...');
});

// server (this)
// node --harmony zmq-watcher-pub.js target.txt

// client
// node --harmony zmq-watcher-sub.js