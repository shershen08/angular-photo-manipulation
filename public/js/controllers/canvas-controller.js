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
  Basic layer structure
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