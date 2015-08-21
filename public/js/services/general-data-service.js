var generalServicefunction = function($http, $window, $q, APP_PRESETS) {

    var serviceObj = {};
    serviceObj.receivedData = [];

    /**
     * @name    getDocumentsList
     * @param   fileID    {String}
     * @returns {jQuery.deferred}
     * @private
     */
    serviceObj.getFilesList = function() {

        var deferred = $q.defer();

        var requestDetails = {
            'folder' : 'test',
            'format' : 'json'
        };

        $http.get('/folderlist', {
            'params' : requestDetails
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status, headers, config) {
            deferred.reject("Error: request returned status " + status);
        });

        return deferred.promise;

    }

    serviceObj.getImageDetails = function(fileName) {

        var deferred = $q.defer();

        $http.get(APP_PRESETS.systemURL + '/imagedetails', {
            'params' : {"filename" : fileName}
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status, headers, config) {
            deferred.reject("Error: request returned status " + status);
        });

        return deferred.promise;

    }


    serviceObj.getCompareImages = function(getRequestObject){


        var deferred = $q.defer();

        $http.get('/getimageparts', {
            'params' : getRequestObject
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status, headers, config) {
            deferred.reject("Error: request returned status " + status);
        });

        return deferred.promise;

    }


     serviceObj.clearTmpFolder = function(){


        var deferred = $q.defer();

        $http.get(APP_PRESETS.systemURL + '/cleartmp').success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status, headers, config) {
            deferred.reject("Error: request returned status " + status);
        });

        return deferred.promise;

    }

      serviceObj.getTwoImages = function(getRequestObject){


        var deferred = $q.defer();
        console.log(getRequestObject.x, getRequestObject._x);
        $http.get('/separateimages', {
            'params' : getRequestObject
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status, headers, config) {
            deferred.reject("Error: request returned status " + status);
        });

        return deferred.promise;

    }
      serviceObj.getImagesBlocks = function(getRequestObject){

        var deferred = $q.defer();
        $http.get('/imageblocks', {
            'params' : getRequestObject
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status, headers, config) {
            deferred.reject("Error: request returned status " + status);
        });

        return deferred.promise;

    }

    return serviceObj;

};

generalServicefunction.$inject = ['$http', '$window', '$q', 'APP_PRESETS'];
app.factory('generalService', generalServicefunction);