

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  _ = require('lodash'),
  jade = require('jade');


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

var server = require('http').createServer(app);

require('./config/express')(app, config);

require('./app/routes')(app, config);

server.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

exports = module.exports = app;