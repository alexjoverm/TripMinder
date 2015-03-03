angular.module('tripminder')

.controller('ResultsCtrl', ['$scope', '$timeout', 'DataSvc', 'MapsSvc',
  function($scope, $timeout, DataSvc, MapsSvc) { 
      
      $scope.searchResults = DataSvc.searchResults;
      console.log($scope.searchResults);

      $scope.map = MapsSvc.CreateMapOriginDest(38.38, -0.51, 16);
      $scope.map.stroke = {
        color: '#387ef5',
        weight: 4
      };
      
      
      // **** Get polyline of map
      MapsSvc.promises.gMapsAPI.then(function(){ 
          
          if($scope.searchResults && $scope.searchResults.car) 
              $scope.map.polyline = MapsSvc.gMapsAPI.geometry.encoding.decodePath($scope.searchResults.car.polyline);
          
      });
      
  }
]);