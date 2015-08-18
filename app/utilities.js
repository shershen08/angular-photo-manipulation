var url = require('url');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

Utils = function(){};

Utils.prototype = {

	getQuery : function(r){
		var url_parts = url.parse(r.url, true);
		var query = url_parts.query;
		return query;
	},
	
	writeJsonResponse : function(r, data){
		r.writeHead(200, {'Content-Type': 'application/json'});
		r.end(JSON.stringify(data));
	},

	writeImageResponse : function(r, data){
		data.toBuffer('jpg', function(err, buffer){
			r.writeHead(200, {'Content-Type': 'image/jpg'});
			r.write(buffer);
			r.end();
		});
	},

	saveImageAndSendUrl : function(img, filepath, r){
		img.writeFile(filepath, function(err){
			r.writeHead(200, {'Content-Type': 'text/html'});
			r.write(filepath);
			r.end();
		});
	},

	getUUIDv4 : function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
			function(c) {
				var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
	},

	handleWrondResponse : function(response, statusCode){
		response.writeHead(statusCode, {'Content-Type': 'text/html'});
		response.end();
	},

	walk : function(currentDirPath, callback) {
		var fs = require('fs'), path = require('path');
		fs.readdirSync(currentDirPath).forEach(function(name) {
			var filePath = path.join(currentDirPath, name);
			var stat = fs.statSync(filePath);
			if (stat.isFile()) {
				callback(filePath, stat);
			} else if (stat.isDirectory()) {
				walk(filePath, callback);
			}
		});
	}
};

var u = new Utils();

module.exports = function(){
	return u;
};