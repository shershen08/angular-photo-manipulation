var composerControllerFunction = function($scope, APP_PRESETS, generalService) {

	generalService.getFilesList().then(function(data){
		$scope.filesList = data;
	})

	$scope._requestDataTemplate = {
		'fileA' : '',
		'fileB' : '',
		'x' : 0,
		'y' : 0,
		'_x' : 100,
		'_y' : 200
	};

	$scope.selectFile = function(fileName, id){
		$scope._requestDataTemplate[('file' + id)] = fileName;
		makeRequest($scope.compareFiles);
	}

	var makeRequest = function (updateData){

		$scope.reqData = angular.extend($scope._requestDataTemplate, updateData);

		generalService.getCompareImages($scope.reqData).then(function(data){

			var frontendUrl = data.split('public/')[1];

			$scope.comparanceImg = frontendUrl;

		});
	}


	$scope.$watch('compareFiles', function(newVal, oldVal){
		makeRequest(newVal);
	})


	var _failCallbacks = function(err){
		console.error('failed to load data!', err);
	}

};


composerControllerFunction.$inject = ['$scope', 'APP_PRESETS', 'generalService'];
app.controller('composerController', composerControllerFunction);