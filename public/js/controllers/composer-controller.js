var composerControllerFunction = function($scope, $log, $timeout, APP_PRESETS, generalService) {

	generalService.getFilesList().then(function(data){
		$scope.filesList = data;
	})
	var increment = 300;
	$scope.imagePieces = [];
	$scope.baseImageData = [];

	$scope._requestDataTemplate = {
		'fileA' : '',
		'fileB' : '',
		'x' : 0,
		'y' : 0,
		'_x' : 100,
		'_y' : 100
	};

	$scope.setAsBase = function(file){

		$scope._requestDataTemplate.fileA = file;

		generalService.getImageDetails(file).then(function(data){
			$scope.baseImageData = data;
		});

	}

	$scope.compareMultiple = function(){
		if(!$scope._requestDataTemplate.fileA || !$scope._requestDataTemplate.fileB) {
			$log.warn('Not both pictures selected');
			return;
		}

		makeRequest($scope._requestDataTemplate);
	}

	$scope.selectFile = function(fileName, id){
		$scope._requestDataTemplate[('file' + id)] = fileName;
		//makeRequest($scope.compareFiles);
	}

	$scope.clearList = function(){
		$scope.imagePieces = [];
	}

	var makeRequest = function (updateData){

		if($scope.baseImageData.width < $scope._requestDataTemplate._x
		|| $scope.baseImageData.height < $scope._requestDataTemplate._y	) {
			$log.warn('Requested size is to big');
			return;
		}

		var _reqData = angular.extend($scope._requestDataTemplate, updateData);

		generalService.getImagesBlocks(_reqData).then(function(data){

			var comparisonObject = {
				'diffdata': '',
				'diffimg' : '',
				'images'  : []
			};

			data.forEach(function(item){
				//comparisonObject.images = item;
				$scope.imagePieces.push({
					'diffdata': '',
					'diffimg' : '',
					'images'  : item
				});
			})

			$timeout(function(){
				$scope.imagePieces.forEach(function(item){
					$scope.resembleRun(item)
				});
			}, 500);
			
		});
		
		


		/*
		//ony type
		generalService.getCompareImages($scope.reqData).then(function(data){
			var frontendUrl = data.split('public/')[1];
			$scope.comparanceImg = frontendUrl;
		});
		*/

		/*
		//gets one part of 2 images
		generalService.getImagesBlocks(_reqData).then(function(data){
			var imgArray  = data.map(function(item){
				var t;
				t = item.split('public/')[1];
				return t;
			})
			var comparisonObject = {
				'diffdata'	: '',
				'diffimg'  : '',
				'images' : imgArray
			};
			$scope.imagePieces.push(comparisonObject);
			$scope.resembleRun(comparisonObject);
		});
		*/
		

	}

	$scope.resembleRun = function(inputObj){
		var images = inputObj.images;
		resemble(images[0])
		.compareTo(images[1])
		.ignoreAntialiasing()
		.onComplete(function(data){

			inputObj.diffdata = data.misMatchPercentage;
			var diffImage = new Image();
			diffImage.src = data.getImageDataUrl();
			inputObj.diffimg = data.getImageDataUrl();
			//$('#image-diff').append(diffPers);
			
			$scope.$apply();
		});


	}

	$scope.cleanTmpFolder = function(){
		generalService.clearTmpFolder().then(function(data){
			console.info('Tmp folder cleaned');
		});
	}



	$scope.$watch('compareFiles', function(newVal, oldVal){
		if (newVal) makeRequest(newVal);
	})


	var _failCallbacks = function(err){
		console.error('failed to load data!', err);
	}

};


composerControllerFunction.$inject = ['$scope', '$log', '$timeout', 'APP_PRESETS', 'generalService'];
app.controller('composerController', composerControllerFunction);