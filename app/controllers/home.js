///global modules

var express = require('express'),
  router = express.Router(),
  config = require('../../config/config'),
  _utils = require('../utilities')();

///controller needed modules

var debug = require('debug')('http');
var jade = require('jade');
var lwip = require('lwip');
var fs = require('fs');
var path = require('path');
var url = require('url');
var _ = require('lodash');
var async = require('async');

//variables
var galleryFilePath = '../files/';  
var tmpFilePath = '../tmp/';

//////////////////////
////// CONTROLLERS
//////////////////////

function displayFileWithEffects(filePath, response, transformationsObject){

  var fileExtension = filePath.split('.');
  fileExtension = fileExtension[(fileExtension.length-1)];

  debug('--------------- displayFile ----------------');
  debug(filePath, transformationsObject);


  lwip.open(filePath, function(err, image){

      if(err) {
          _utils.handleWrondResponse(response, 404);
          return;
      }


      var buffer;
      var newFileName = getUUIDv4() + '.' + fileExtension;
      var newFilePath = path.join(__dirname, (tmpFilePath + newFileName));
      var img = image.batch();

      transformationsObject.forEach(function(propItem){
        if(propItem.settings.active == true){
          if(_.isArray(propItem.settings.amount)){
            //debug('isArray', propItem.settings.amount, this);
            Function.prototype.apply(img[propItem.type], propItem.settings.amount);
          } else {
            debug('is string');
            img[propItem.type](propItem.settings.amount);
          }
        } 
      });

      img.writeFile(newFilePath, function(err){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(newFilePath);
        response.end();
      });

  });
}


//http://localhost:3000/getimageparts?fileA=IMG_3031.jpg&fileB=IMG_3032.jpg&xStart=0&xStart=0&xEnd=100&yEnd=100

function displayFileParts(cropConfig, response){

  var fileExtension = cropConfig.aPath.split('.');
  fileExtension = fileExtension[(fileExtension.length-1)];

  debug(cropConfig);

  var selectionHeight = parseInt(cropConfig.yEnd - cropConfig.yStart);
  var selectionLength = parseInt(cropConfig.xEnd - cropConfig.xStart);
  var tmpFilePath = '../tmp/';
  var _v = parseInt(cropConfig.xStart);
  var _h = parseInt(cropConfig.yStart);

  if(selectionLength <= 0 || selectionLength <= 0 )  {
    _utils.handleWrondResponse(response, 400);
    return ;
  }

 lwip.create(selectionLength*2, selectionHeight, 'white', function(err, baseImageInitial){

  function taskDone(tID){
    debug(' ----------- Task ', tID);
  }

  async.waterfall([
    //
    //image 1
    function(taskDone) {
      lwip.open(cropConfig.aPath, function(err, image){
        taskDone(err, image, '1');
      });
    },
    function(imageOpened1, err, taskDone){
      //if(err) { _utils.handleWrondResponse(response, 404); return; }
      imageOpened1.crop(_v, _h, _v + (selectionLength-1), _h + (selectionHeight-1),
        function(err, imageCropped){
          taskDone(err, imageCropped, '2');
      })
    },
    function(image, err, taskDone){
      baseImageInitial.paste(0, 0, image, function(err, imageResult){
         taskDone(err, imageResult, '3');
      });
    },
    //
    //image 2
    function(mainImg, err, taskDone) {
      lwip.open(cropConfig.bPath, function(err, image){
        taskDone(err, image, mainImg, '4');
      });
    },
    function(imageOpened2, mainImg, err, taskDone){
      //if(err) { _utils.handleWrondResponse(response, 404); return; }
      imageOpened2.crop(_v, _h, _v + (selectionLength-1), _h + (selectionHeight-1),
        function(err, imageCropped){
          taskDone(err, imageCropped, mainImg, '5');
      })
    },
    function(image, mainImg, err, taskDone){
      baseImageInitial.paste((selectionLength-1), 0, image, function(err, imageResult){






         taskDone(err, imageResult, '6');
      });
    }
  ], function (err, result) {

  result.toBuffer('jpg', function(err, buffer){
    response.writeHead(200, {'Content-Type': 'image/jpg'});
    response.write(buffer);
    response.end();
  });

});

    
 })
}





//////////////
///// ROUTES
//////////////


router.post('/', function (req, res, next) {
  debug('----------------- /home::/ -----------------');
  next();
});


router.use('/layout', function (req, res, next) {
  debug('----------------- /layout -----------------');
  res.render('layout', { title : 'layout page', content: 'content test' }); 
});

router.get('/api/folderlist', function (req, res) {
  debug('----------------- /folderlist -----------------');
  var query = _utils.getQuery(req);
  if(query.folder){
    
    var filePathArray = [];

    _utils.walk(path.join(__dirname, galleryFilePath ), function(filePath, stat) {
      var fileName = filePath.split('/');
      fileName = fileName[fileName.length-1];
      if(fileName[0] != '.'){
        filePathArray.push(fileName);
      }
    });

    if(query.format == 'json') {
      _utils.writeJsonResponse(res, filePathArray);
    } else {
      res.render('folderlist', { title : query.folder, files: filePathArray}); 
    }
    

  } else {
    _utils.handleWrondResponse(res, 400);
  }
});

router.get('/api/getimageparts', function (req, res, next) {
  debug('----------------- /getimageparts -----------------');


  var query = _utils.getQuery(req);
  debug(query);

  if(query.fileA && query.fileB){
    var fileConfig = {
      'aPath' : path.join(__dirname, (galleryFilePath + query.fileA)),
      'bPath' : path.join(__dirname, (galleryFilePath + query.fileB)),
      'xStart': (query.x || 0),
      'yStart': (query.y || 0),
      'xEnd': (query._x || 100),
      'yEnd': (query._y || 100)
    }
    displayFileParts(fileConfig, res);
  } else {
    _utils.handleWrondResponse(res, 400);
  }
});


router.post('/api/imageanalysis', function (req, res, next) {
  debug('----------------- /imageanalysis -----------------');

  var query = req.body;

  if(query.file){
    var filePath = path.join(__dirname, (galleryFilePath + query.file));
    var transformationsObject = query.effects;
    displayFileWithEffects(filePath, res, transformationsObject);
  } else {
    _utils.handleWrondResponse(res, 400);
  }
});

module.exports = function (app) {
  app.use('/', router);

};