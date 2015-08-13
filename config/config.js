var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    name : 'dev',
    root: rootPath,
    app: {
      name: 'image-twister'
    },
    port: 3000
    //,db: 'mongodb://localhost/image-twister-development'
  },

  test: {
    name : 'test',
    root: rootPath,
    app: {
      name: 'image-twister'
    },
    port: 3000
    ,db: 'mongodb://localhost/image-twister-test'
  },

  production: {
    name : 'prod',
    root: rootPath,
    app: {
      name: 'image-twister'
    },
    port: 3000
    ,db: 'mongodb://localhost/image-twister-production'
  }
};

module.exports = config[env];
