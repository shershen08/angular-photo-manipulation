var app = angular.module("app", ['ngDialog']);

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
    }
});

app.controller("canvasCont", ['$scope', '$rootScope','ngDialog', 'APP_PRESETS',
    function($scope, $rootScope, ngDialog, APP_PRESETS) {
      
  $scope.selectedcolor,
  $scope.selectedsize,
  $scope.layers = [];
  
  $scope.colorsArray = APP_PRESETS.colors;
  $scope.sizesArray = APP_PRESETS.sizes;
  $scope.canvasWidth = APP_PRESETS.canvas.width;
  $scope.canvasHeight = APP_PRESETS.canvas.height;
  
  $scope.selectColor = function(c) {
    $scope.selectedcolor = c;
    $rootScope.selectedcolor = c;
  }

  $scope.selectSize = function(s) {
    $scope.selectedsize = s;
    $rootScope.selectedsize = s;
  }


  /*
  basic layer structure

  */
  
  $scope.saveLayerName = function(newlayername){
      
      if (newlayername.length < 2) {
        $scope.newlayername_note = 'Too short layer name';
        return false;
      }
      
      var newLyr = angular.extend({
      "name": "untitled",
      "id": 0,
      "visible": true
    }, {
      "name": newlayername,
      "id": Date.now().toString().substr(5),
      "visible": true
    });
    $scope.layers.push(newLyr);
    
    return true;
    
  }
  
  $scope.addLayer = function() {

    ngDialog.open({
      template: 'templates/addLayertemplate.html',
      scope: $scope,
      plain: false
  });

  }

  $scope.removeThis = function(lr) {
    $scope.layers = $scope.layers.filter(function(item) {
      return item.id != lr.id;
    })
  };

  $scope.toggleThis = function(lr) {
    lr.visible = !lr.visible;
  }
  
  $scope.selectThis = function(lr){
    $scope.activeLayerIndex = lr.id;
    $rootScope.activeLayerID = lr.id;
  }
  
}])

app.directive("drawing", function($rootScope) {
  return {
    scope: {
      sel: '=',
      layerid : '='
    },
    restrict: "A",
    link: function(scope, element, attrs) {
      var ctx = element[0].getContext('2d');

      // variable that decides if something should be drawn on mousemove
      var drawing = false;

      // the last coordinates before the current move
      var lastX;
      var lastY;

      element.bind('mousedown', function(event) {
        
        if ($rootScope.activeLayerID == scope.layerid) {
        
          if (event.offsetX !== undefined) {
            lastX = event.offsetX;
            lastY = event.offsetY;
          } else {
            lastX = event.layerX - event.currentTarget.offsetLeft;
            lastY = event.layerY - event.currentTarget.offsetTop;
          }
  
          // begins new line
          ctx.beginPath();
  
          drawing = true;
        }
      });
      element.bind('mousemove', function(event) {
        
        if ($rootScope.activeLayerID == scope.layerid) {
        
          if (drawing) {
            // get current mouse position
            if (event.offsetX !== undefined) {
              currentX = event.offsetX;
              currentY = event.offsetY;
            } else {
              currentX = event.layerX - event.currentTarget.offsetLeft;
              currentY = event.layerY - event.currentTarget.offsetTop;
            }
  
            draw(lastX, lastY, currentX, currentY);
  
            // set current coordinates to last one
            lastX = currentX;
            lastY = currentY;
          }
        }

      });
      element.bind('mouseup', function(event) {
        // stop drawing
        drawing = false;
      });

      // canvas reset
      function reset() {
        element[0].width = element[0].width;
      }

      function draw(lX, lY, cX, cY) {
        // line from
        ctx.moveTo(lX, lY);
        // to
        ctx.lineTo(cX, cY);
        // color
        ctx.strokeStyle = $rootScope.selectedcolor;
        ctx.lineWidth = $rootScope.selectedsize;
        // draw it
        ctx.stroke();
      }
    }
  };
});

/*
function colorPicker(){
  var img = new Image();
img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
img.onload = function() {
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
};
var color = document.getElementById('color');
function pick(event) {
  var x = event.layerX;
  var y = event.layerY;
  var pixel = ctx.getImageData(x, y, 1, 1);
  var data = pixel.data;
  var rgba = 'rgba(' + data[0] + ',' + data[1] +
             ',' + data[2] + ',' + data[3] + ')';
  color.style.background =  rgba;
  color.textContent = rgba;
}
canvas.addEventListener('mousemove', pick);
}
*/