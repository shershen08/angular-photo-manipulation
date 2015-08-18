function scoringService($q) {
  
  var scoreItems = function (items, weights) {
    var deferred = $q.defer();
    var worker = new Worker('../lib/worker.js');
    var orders = {
      items: items,
      weights: weights
    };
    worker.postMessage(orders);
    worker.onmessage = function (e) {
      if (e.data && e.data.ready) {
        deferred.resolve(e.data.items);
      }
    };

    return deferred.promise;
  };
  var hostObject = {
    scoreItems: function (items, weights) {
      return scoreItems(items, weights);
    }
  };

  return hostObject;

}

app.factory('scoringService', scoringService);