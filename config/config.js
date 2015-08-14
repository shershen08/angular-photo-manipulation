var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

    if (env == 'development') {
      process.env.DEBUG = 'http';
    }

var config = {
  development: {
    name : 'dev',
    root: rootPath,
    app: {
      name: 'image-twister'
    },
    port: 3000,
    uploadDir: '/api/uploads',
    uploadedFilesDir: 'public/gallery'
    //,db: 'mongodb://localhost/image-twister-development'
  },

  test: {
    name : 'test',
    root: rootPath,
    app: {
      name: 'image-twister'
    },
    port: 3000
    ,db: 'mongodb://localhost/image-twister-test',
    uploadDir: '/api/uploads'
  },

  production: {
    name : 'prod',
    root: rootPath,
    app: {
      name: 'image-twister'
    },
    port: 3000
    ,db: 'mongodb://localhost/image-twister-production',
    uploadDir: '/api/uploads'
  }
};

module.exports = config[env];
