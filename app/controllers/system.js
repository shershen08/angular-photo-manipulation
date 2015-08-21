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
var lwip = require('lwip');


router.get('/api/system/cleartmp', function (req, res, next) {
  debug('----------------- /Api::system::cleartmp/ -----------------');

  var fullTmpPath = path.join(__dirname, config.tmpFilePath);
  _utils.removeDirectoryContent(fullTmpPath, false);

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end();
});

router.get('/api/system/imagedetails', function (req, res, next) {
  debug('----------------- /Api::imagedetails/ -----------------');

  var query = _utils.getQuery(req);

  if (query.filename) {

  	var fileReadPath = path.join(__dirname, (config.galleryFilePath + query.filename))

 	lwip.open(fileReadPath, function(err, image){
         var imgData = {};
         imgData.width = image.width();
         imgData.height = image.height();
         _utils.writeJsonResponse(res, imgData);
      });

 } else {

    _utils.handleWrondResponse(res, 400);
  }

});



//module.exports = new UploadController();

module.exports = function (app) {
	app.use('/', router);

};
