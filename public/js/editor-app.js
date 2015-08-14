var app = angular.module("app", ['ngDialog', 'ui.router', 'ngFileUpload']);

app.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: true,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
}]);

app.constant('APP_PRESETS', {
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
    'uploadDir': '/api/uploads'
});