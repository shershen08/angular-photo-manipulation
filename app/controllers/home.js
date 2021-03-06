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
var Promise = require('promise');

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
    var newFileName = _utils.getUUIDv4() + '.' + fileExtension;
    var newFilePath = path.join(__dirname, (config.tmpFilePath + newFileName));
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

    _utils.saveImageAndSendUrl(img, newFilePath, response);

  });
}


// /api/getimageparts?fileA=IMG_3031.jpg&fileB=IMG_3032.jpg&xStart=0&xStart=0&xEnd=100&yEnd=100

function displayFileParts(cropConfig, response){

  var fileExtension = cropConfig.aPath.split('.');
  fileExtension = fileExtension[(fileExtension.length-1)];

  debug(cropConfig);

  var selectionHeight = parseInt(cropConfig.yEnd - cropConfig.yStart);
  var selectionLength = parseInt(cropConfig.xEnd - cropConfig.xStart);

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

    //can write image - but for now shows url
    //_utils.writeImageResponse(response, result);

    _utils.saveImageAndSendUrl(result, getNewFilePath(fileExtension), response);
  });


})
}

function getNewFilePath(fileExtension){
  var newFileName = _utils.getUUIDv4() + '.' + fileExtension;
  var newFilePath = path.join(__dirname, (config.tmpFilePath + newFileName));
  return newFilePath;
}

function displayTwoFileParts(cropConfig, response, routerCallback){

  var fileExtension = cropConfig.aPath.split('.');
  fileExtension = fileExtension[(fileExtension.length-1)];

  debug(cropConfig);

  function adjustFilePath(backendFilePath){
    return backendFilePath.replace('/Users/mkuznetcov/_Standalone/photo-cleaner/public', '');
  }

  var selectionHeight = parseInt(cropConfig.yEnd - cropConfig.yStart);
  var selectionLength = parseInt(cropConfig.xEnd - cropConfig.xStart);

  var _v = parseInt(cropConfig.xStart);
  var _h = parseInt(cropConfig.yStart);

  if(selectionLength <= 0 || selectionLength <= 0 )  {
    _utils.handleWrondResponse(response, 400);
    return ;
  }

  var _fileoperation_ = new Promise(function(resolve, reject){

    lwip.create(selectionLength*2, selectionHeight, 'white', function(err, baseImageInitial){

      function taskDone(tID){
        debug(' ----------- Task ', tID);
      }

      async.parallel([
    //
    //image 1
    function(taskDone) {
      lwip.open(cropConfig.aPath, function(err, image){
       image.crop(_v, _h, _v + (selectionLength-1), _h + (selectionHeight-1),
        function(err, imageCropped){
          var newFilePath = getNewFilePath(fileExtension);
          imageCropped.writeFile(newFilePath, function(err){
            taskDone(err, adjustFilePath(newFilePath));
          });
        })
     });
    },
    //
    //image 2
    function(taskDone) {
      lwip.open(cropConfig.bPath, function(err, image){
        image.crop(_v, _h, _v + (selectionLength-1), _h + (selectionHeight-1),
          function(err, imageCropped2){
            var newFilePath = getNewFilePath(fileExtension);
            imageCropped2.writeFile(newFilePath, function(err){
              taskDone(err, adjustFilePath(newFilePath));
            });
          });
      });
    }
    ], function (err, result) {
      if(err) reject(err);
      resolve(result);//_fileoperation_.resolve('file group processed!');
    }); 
  })
});
return _fileoperation_;
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

    _utils.walk(path.join(__dirname, config.galleryFilePath ), function(filePath, stat) {
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

  if(query.fileA && query.fileB){
    var fileConfig = {
      'aPath' : path.join(__dirname, (config.galleryFilePath + query.fileA)),
      'bPath' : path.join(__dirname, (config.galleryFilePath + query.fileB)),
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

router.get('/api/separateimages', function (req, res, next) {
  debug('----------------- /separateimages -----------------');


  var query = _utils.getQuery(req);

  if(query.fileA && query.fileB){
    var fileConfig = {
      'aPath' : path.join(__dirname, (config.galleryFilePath + query.fileA)),
      'bPath' : path.join(__dirname, (config.galleryFilePath + query.fileB)),
      'xStart': (query.x || 0),
      'yStart': (query.y || 0),
      'xEnd': (query._x || 100),
      'yEnd': (query._y || 100)
    }
    displayTwoFileParts(fileConfig, res, _utils.sendImagesArray);
  } else {
    _utils.handleWrondResponse(res, 400);
  }
});


router.get('/api/imageblocks', function (req, res, next) {
  debug('----------------- /imageblocks -----------------');

  var query = _utils.getQuery(req),
  processArray = [],
  increment = 50;

    if(query.fileA && query.fileB){

       for (var i = 0; (i + increment) < 750; i = i + increment){
         for (var j = 0; (j + increment) < 750; j = j + increment){

          var fileConfig = {
          'aPath' : path.join(__dirname, (config.galleryFilePath + query.fileA)),
          'bPath' : path.join(__dirname, (config.galleryFilePath + query.fileB)),
          'xStart': (i || 0),
          'yStart': (j || 0),
          'xEnd': ((i + increment) || 100),
          'yEnd': ((j + increment) || 100)
        }
        processArray.push(displayTwoFileParts(fileConfig, res));
      }
    }
      
      Promise.all(processArray).then(function(collectArrays){
        _utils.sendImagesArray(collectArrays, res);
      });
      
    } else {
      _utils.handleWrondResponse(res, 400);
    }
  });

router.post('/api/imageanalysis', function (req, res, next) {
  debug('----------------- /imageanalysis -----------------');

  var query = req.body;

  if(query.file){
    var filePath = path.join(__dirname, (config.galleryFilePath + query.file));
    var transformationsObject = query.effects;
    displayFileWithEffects(filePath, res, transformationsObject);
  } else {
    _utils.handleWrondResponse(res, 400);
  }
});

module.exports = function (app) {
  app.use('/', router);

};