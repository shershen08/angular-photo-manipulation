
var apiInterceptorFunction = function(APP_PRESETS) {

    var apiUrl = APP_PRESETS.API_URL;
    var shouldIntercept = true;

    return {
    request: function(reqConfig) {
              if (shouldIntercept) {
                  reqConfig.url = apiUrl + reqConfig.url;
              }
              return reqConfig;
          }
    };
}

apiInterceptorFunction.$inject = ['APP_PRESETS'];
app.factory('apiInterceptor', apiInterceptorFunction);