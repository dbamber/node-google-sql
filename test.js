var google = require('./lib.js');

var user = process.argv[2];
var pass = process.argv[3];

google.login(user,pass, function () {
	console.log('Logged in');
});

