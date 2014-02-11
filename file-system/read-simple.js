const fs = require('fs');

fs.readFile('target.txt', function(err, data) {
	if (err) {
		throw err;
	}

	console.log(data.toString());
});

// node --harmony read-simple.js