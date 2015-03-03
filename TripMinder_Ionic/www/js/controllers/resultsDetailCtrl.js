angular.module('tripminder')

.controller('ResultsDetailCtrl', ['$scope', '$stateParams', '$timeout', 'DataSvc', 'MapsSvc',
  function($scope, $stateParams, $timeout, DataSvc, MapsSvc) { 
      
      $scope.route = DataSvc.searchResults[$stateParams.id];

      $scope.map = MapsSvc.CreateMapOriginDest(38.38, -0.51, 16);
      $scope.map.stroke = {
        color: '#387ef5',
        weight: 4
      };
      
      
      // **** Get polyline of map
      MapsSvc.promises.gMapsAPI.then(function(){ 
          
          // COMPROBAR SI PROVIENE DE GOOGLE MAPS O ES UNA LINEA DE PUNTOS
          if($scope.route) 
              $scope.map.polyline = MapsSvc.gMapsAPI.geometry.encoding.decodePath($scope.route.polyline);
          
          console.log($scope.map.polyline);
          
      });
      
  }
]);