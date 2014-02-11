const 
events = require('events'),
util = require('util'),

// client constructor
LDJClient = function(stream) {
	events.EventEmitter.call(this);
};

util.inherits(LDJClient, events.EventEmitter);

// clients call 'new LDJClient(stream)'