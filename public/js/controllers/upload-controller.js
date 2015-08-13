app.controller("uploadCtrl", ['$scope', '$rootScope', 'Upload',
    function($scope, $rootScope, Upload) {


    $scope.$watch('file', function (file) {
    	if (file) $scope.upload($scope.file);
    });

    $scope.upload = function (file) {

        Upload.upload({
            url: 'upload/url',
            file: file
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
        })
    };

}]);