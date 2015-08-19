var express = require('express'),
router = express.Router(),
config = require('../../config/config'),
_utils = require('../utilities')();

var debug = require('debug')('http');
var jade = require('jade');
var lwip = require('lwip');
var fs = require('fs');
var path = require('path');
var fs = require('fs');


router.get('/api/system/cleartmp', function (req, res, next) {
  debug('----------------- /Api::system/ -----------------');

  var fullTmpPath = path.join(__dirname, config.tmpFilePath);
  _utils.removeDirectoryContent(fullTmpPath, false);

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end();
});


//module.exports = new UploadController();

module.exports = function (app) {
	app.use('/', router);

};
