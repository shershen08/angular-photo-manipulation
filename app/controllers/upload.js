var express = require('express'),
router = express.Router(),
config = require('../../config/config');

var debug = require('debug')('http');
var jade = require('jade');
var lwip = require('lwip');
var fs = require('fs');
var path = require('path');
var multiparty = require('connect-multiparty');
var fs = require('fs');


multipartyMiddleware = multiparty();


function moveUploadedFile(sourceFileStream){

	var source = fs.createReadStream(sourceFileStream);
	var dest = fs.createWriteStream(config.uploadedFilesDir);

	source.pipe(dest);
	source.on('end', function() { 
		debug('moveUploadedFile successful')
		 });
	source.on('error', function(err) { 
		debug('moveUploadedFile resulted an error ', err)
	 });

}


router.post(config.uploadDir, multipartyMiddleware, function(req, res){

	var file = req.files.file;
	debug('uploadFile: ', file.type, file.name);

	moveUploadedFile(file);

	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end();
});


router.get('/', function (req, res, next) {
  debug('----------------- /UploadController::/ -----------------');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end();
});


//module.exports = new UploadController();

module.exports = function (app) {
	app.use('/', router);

};
