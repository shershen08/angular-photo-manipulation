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
		/*
		generalService.getCompareImages($scope.reqData).then(function(data){
			var frontendUrl = data.split('public/')[1];
			$scope.comparanceImg = frontendUrl;
		});
*/

generalService.getTwoImages($scope.reqData).then(function(data){
	$scope.comparanceImg = data.map(function(item){
		var t;
		t = item.split('public/')[1];
		return t;
	})
	$scope.resembleRun();
});

}

$scope.resembleRun = function(){

	resemble($scope.comparanceImg[0]).compareTo($scope.comparanceImg[1])
	.ignoreAntialiasing().onComplete(function(data){

		$scope.diffPers = data.misMatchPercentage;
		var diffImage = new Image();
		diffImage.src = data.getImageDataUrl();
		$('#image-diff').html(diffImage);
		
		$scope.$apply();
	});


}

$scope.cleanTmpFolder = function(){
	generalService.clearTmpFolder().then(function(data){
		console.info('Tmp folder cleaned');
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