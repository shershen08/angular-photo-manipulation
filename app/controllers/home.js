var express = require('express'),
  router = express.Router(),
  config = require('../../config/config');

var debug = require('debug')('http');
var jade = require('jade');
var lwip = require('lwip');
var fs = require('fs');
var path = require('path');
var url = require('url');
var _ = require('lodash');
var async = require('async');


///////////////////
//////   UTILITIES
///////////////////


function getQuery(r){
  var url_parts = url.parse(r.url, true);
  var query = url_parts.query;
  return query;
}

function getUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}


function handleWrondResponse(response, statusCode){
  response.writeHead(statusCode, {'Content-Type': 'text/html'});
  response.end();
}



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
          handleWrondResponse(response, 404);
          return;
      }

      var tmpFilePath = '../tmp/';
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

/*
        image.batch()
            //.rotate(45, 'white')
            .resize(500, 500)
            .pad(5,5,5,5)
            .saturate(5)
            .blur(1)
           .writeFile(newFilePath, function(err){
              response.writeHead(200, {'Content-Type': 'text/html'});
              response.write(newFilePath);
              response.end();
            });
*/
           /*
            .toBuffer(fileExtension, function(err, buffer){
              response.writeHead(200, {'Content-Type': ('image/' + fileExtension)});
              response.sendfile(buffer);
             // response.write(buffer);
              response.end();
            });
          */
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

  if(selectionLength <= 0 || selectionLength <= 0 )  handleWrondResponse(response, 400);

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
       //if(err) { handleWrondResponse(response, 404); return; }
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
       //if(err) { handleWrondResponse(response, 404); return; }
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



router.get('/getimageparts', function (req, res, next) {
  debug('----------------- /getimageparts -----------------');

  var galleryFilePath = '../files/';  
  var query = getQuery(req);
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
    handleWrondResponse(res, 400);
  }
});


router.post('/imageanalysis', function (req, res, next) {
  debug('----------------- /imageanalysis -----------------');

  var galleryFilePath = '../files/';  
  var query = req.body;

  if(query.file){
    var filePath = path.join(__dirname, (galleryFilePath + query.file));
    var transformationsObject = query.effects;
    displayFileWithEffects(filePath, res, transformationsObject);
  } else {
    handleWrondResponse(res, 400);
  }
});

module.exports = function (app) {
  app.use('/', router);

};




