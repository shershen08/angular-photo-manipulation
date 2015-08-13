

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  resemblejs = require('resemblejs'),
  _ = require('lodash'),
  jade = require('jade');

console.log(config.name);

if(config.name != 'dev') {
	mongoose = require('mongoose');

	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error', function () {
	  throw new Error('unable to connect to database at ' + config.db);
	});

	var models = glob.sync(config.root + '/app/models/*.js');
	models.forEach(function (model) {
	  require(model);
	});
}



var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

