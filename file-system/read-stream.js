const 
fs = require('fs'),
stream = fs.createReadStream(process.argv[2]);

stream.on('data', function(chunk) {
	process.stdout.write(chunk);
});

stream.on('error', function(err) {
	process.stderr.write("ERROR: " + err.message + "\n");
});

// node --harmony read-stream.js target.txt
// node --harmony read-stream.js no-such-file
