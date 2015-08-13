var express = require('express'),
  router = express.Router();


var debug = require('debug')('http');
var jade = require('jade');
var lwip = require('lwip');
var fs = require('fs');
var path = require('path');
var multipart = require('connect-multiparty');

app.use(multipart({
    uploadDir: config.tmp
}));

 // mongoose = require('mongoose'),
  //Article = mongoose.model('Article');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  /*
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
*/
});


router.get('/layout', function (req, res, next) {
  debug('----------------- /layout -----------------');
  res.render('layout', { title : 'layout page', content: 'content test' }); 
});


router.get('/imageanalysis', function (req, res, next) {
  debug('----------------- /imageanalysis -----------------');

  var tmpFilePath = '../files/'; //IMG_3031.JPG - IMG_3034.JPG


  var filePath1 = path.join(__dirname, (tmpFilePath + 'IMG_3031.jpg'));
  var filePath2 = path.join(__dirname, (tmpFilePath + 'IMG_3034.jpg'));


    lwip.open(filePath1, function(err, image){
            // check 'err'. use 'image'.

    image.batch()
        //.rotate(45, 'white')
        .resize(500, 500)
        .pad(5,5,5,5)
        .saturate(5)
        //.blur(1)
        .toBuffer('jpg', {quality: 30}, function(err, buffer){
              res.writeHead(200, {'Content-Type': 'image/jpg'});
              res.write(buffer);
              res.end();
          });

    });

    
    /*
  fs.readFile(filePath1, {encoding: 'utf-8'}, function(err,data1){
      if (!err){
    
      }else{
          debug('filePath1 reading error ', err);
      }
  });
  */


});


exports.create = function (req, res, next) {
    var data = _.pick(req.body, 'type')
        , uploadPath = path.normalize(cfg.data + '/uploads')
        , file = req.files.file;

        console.log(file.name); //original name (ie: sunset.png)
        console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
    console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
};
