var composerControllerFunction = function($scope, APP_PRESETS, generalService) {

	$scope.test = '123';

	generalService.getFilesList().then(function(data){
		$scope.test = data;
	})

};


composerControllerFunction.$inject = ['$scope', 'APP_PRESETS', 'generalService'];
app.controller('composerController', composerControllerFunction);