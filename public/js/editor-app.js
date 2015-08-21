var app = angular.module("app", ['ngDialog', 'ui.router', 'ngFileUpload', 'keyboard']);

app.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: true,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
}])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('apiInterceptor');

    $httpProvider.defaults.headers.get = {};    
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}])
.constant('APP_PRESETS', {
    'colors' : ['#000','#f00','#0f0','#00f','#fff', '#00FA9A', '#FFA500', '#FFFF00'],
    'sizes' : [3,5,10,20],
    'canvas' : {
      'width' : 500,
      'height': 200
    },
    'basicLayer' : {
      "name": "untitled",
      "id": 0,
      "visible": true
    },
    'uploadDir': '/api/uploads',
    'API_URL' : '/api',
    'systemURL' : '/system'
});