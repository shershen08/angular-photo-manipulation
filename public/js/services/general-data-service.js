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

        $http.get('/api/folderlist', requestDetails).success(function(data) {
            deferred.resolve(data.response);
        }).error(function(data, status, headers, config) {
            deferred.reject("Error: request returned status " + status);
        });

        return deferred.promise;

    }

    return serviceObj;

};

generalServicefunction.$inject = ['$http', '$window', '$q', 'APP_PRESETS'];
app.factory('generalService', generalServicefunction);