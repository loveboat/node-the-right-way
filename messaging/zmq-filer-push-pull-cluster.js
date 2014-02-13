'use strict';

const
cluster = require('cluster'),
fs = require('fs'),
zmq = require('zmq');

let readyWorkers = 0;

if (cluster.isMaster) {
	// master process - create PUSH and PULL sockets, bind endpoints
	let
	push = zmq.socket('push').bind('ipc://master-to-worker.ipc'),
	pull = zmq.socket('pull').bind('ipc://worker-to-master.ipc');

	// listen for messages from a worker
	pull.on('message', function(data) {
		let message = JSON.parse(data);
		if (message.type === 'ready') {
			readyWorkers += 1;

			// send messages when all workers are online
			if (readyWorkers === 3) {
				console.log("All workers are ready. Dispatching work.");

				// push messages to workers
				for (let i = 0; i < 30; i++) {
					push.send(JSON.stringify({
						type: 'job',
						timestamp: Date.now()
					}));
				}
			}
		} 
		else if (message.type === 'result') {
			console.log('Message received (M): ', message);
		}
	});

	// listen for workers to come online
	cluster.on('online', function(worker) {
		console.log('Worker ' + worker.process.pid + ' is online.');
	});

	// fork three worker processes
	for (let i = 0; i < 3; i++) {
		cluster.fork();
	}
} 
else {
	// worker process - create PULL and PUSH sockets
	let
	workerPull = zmq.socket('pull').connect('ipc://master-to-worker.ipc'),
	workerPush = zmq.socket('push').connect('ipc://worker-to-master.ipc');

	// listen for messages on the PULL socket.
	workerPull.on('message', function(data) {
		// treat this as a job
		let message = JSON.parse(data);
		console.log('Message received (W): ', message);

		// respond with a 'result'
		workerPush.send(JSON.stringify({
			type: 'result',
			process: process.pid,
			timestamp: Date.now()
		}));
	});

	// signal we are ready
	workerPush.send(JSON.stringify({
		type: 'ready'
	}));
}

// server
// node --harmony zmq-filer-push-pull-cluster.js