module.exports = function () {

	var express = require('express');
    var groups = require('./api/groups');

    groups.populate();

    var app = express();

    // API
    // Groups
	app.get('/groups', groups.all);
	app.get('/groups/:id', groups.get);

    // Serve client files
	app.use(express.static('client'));

	app.listen(3000);

	console.log('Listening on port 3000');

}();