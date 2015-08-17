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

 // mongoose = require('mongoose'),
  //Article = mongoose.model('Article');

router.post('/', function (req, res, next) {
  debug('----------------- /home::/ -----------------');
  next();
});


router.use('/layout', function (req, res, next) {
  debug('----------------- /layout -----------------');
  res.render('layout', { title : 'layout page', content: 'content test' }); 
});


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

function displayFile(filePath, response, transformationsObject){

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

/*
{
    "file": "IMG_3031.jpg",
    "effects": [
        {
            "type": "rotate",
            "settings": {
                "active": true,
                "amount": 45
            }
        },
        {
            "type": "saturate",
            "settings": {
                "active": true,
                "amount": 1
            }
        },
        {
            "type": "blur",
            "settings": {
                "active": false,
                "amount": 1
            }
        },
        {
            "type": "resize",
            "settings": {
                "active": false,
                "amount": 1
            }
        },
        {
            "type": "pad",
            "settings": {
                "active": false,
                "amount": [
                    5,
                    5,
                    5,
                    5
                ]
            }
        },
        {
            "type": "crop",
            "settings": {
                "active": false,
                "amount": [
                    200,
                    200
                ]
            }
        }
    ]
}
*/
function applyTransformations(batchObj, configObject){



  return batchObj;
}

function handleWrondResponse(response, statusCode){
  response.writeHead(statusCode, {'Content-Type': 'text/html'});
  response.end();
}

router.post('/imageanalysis', function (req, res, next) {
  debug('----------------- /imageanalysis -----------------');

  var galleryFilePath = '../files/';  
  var query = req.body;

  if(query.file){
    var filePath = path.join(__dirname, (galleryFilePath + query.file));
    var transformationsObject = query.effects;
    displayFile(filePath, res, transformationsObject);
  } else {
    handleWrondResponse(res, 400);
  }
});

module.exports = function (app) {
  app.use('/', router);

};




