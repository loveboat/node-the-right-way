'use strict';

const
fs = require('fs'),
zmq = require('zmq'),

// socket to reply to client requests
responder = zmq.socket('rep');

// handle incoming requests
responder.on('message', function(data) {
	// parse incoming message
	let request = JSON.parse(data);
	console.log('Received request to get: ' + request.path);

	// read file and reply with content
	fs.readFile(request.path, function(err, content) {
		if (err) {
			content = 'Error: ' + err.message;
			console.log('Sending error response');
		} else {
			console.log('Sending response content');
		}
		responder.send(JSON.stringify({
			content: content.toString(),
			timestamp: Date.now(),
			pid: process.pid
		}));
		if (err) {
			throw err;
		}
	});
});

// listen on TCP port 5433
responder.bind('tcp://127.0.0.1:5433', function(err) {
	console.log('Listening for zmq requesters...');
});

// close the responder when the Node process ends
process.on('SIGINT', function() {
	console.log('Shutting down...');
	responder.close();
});

// handle the process being terminated
process.on('SIGTERM', function() {
	console.log('Shutting down (terminated)...');
	responder.close();
});

// handle any other uncaught exceptions
process.on('uncaughtException', function(err) {
	console.log("Exception: " + err.message);
});

// node --harmony zmq-filer-rep.js