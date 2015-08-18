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

        $http.get('/api/folderlist', {
            'params' : requestDetails
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status, headers, config) {
            deferred.reject("Error: request returned status " + status);
        });

        return deferred.promise;

    }


    serviceObj.getCompareImages = function(getRequestObject){


        var deferred = $q.defer();

        $http.get('/api/getimageparts', {
            'params' : getRequestObject
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data, status, headers, config) {
            deferred.reject("Error: request returned status " + status);
        });

        return deferred.promise;

    }

      serviceObj.getTwoImages = function(getRequestObject){


        var deferred = $q.defer();

        $http.get('/api/separateimages', {
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