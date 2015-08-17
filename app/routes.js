/**
 * Main application routes
 */

'use strict';
//var errors = require('./components/errors');
var path = require('path');


module.exports = function(app) {

  // Insert routes below
  //app.route('/api', require('./controllers/upload'));
  //app.route('/test', require('./controllers/home'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(function(req, res){

   	 res.writeHead(404, {'Content-Type': 'text/html'});
   	 res.write('404');
     res.end();
   });

  // All other routes should redirect to the index.html
  app.route('/').get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
