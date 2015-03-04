angular.module('tripminder')

.controller('ResultsDetailCtrl', ['$scope', '$stateParams', '$timeout', 'DataSvc', 'MapsSvc',
  function($scope, $stateParams, $timeout, DataSvc, MapsSvc) { 
      
      $scope.route = DataSvc.searchResults[$stateParams.id][$stateParams.num];
      
      console.log($stateParams.id);
      console.log($stateParams.num);
      console.log(DataSvc.searchResults[$stateParams.id]);
      console.log(DataSvc.searchResults[$stateParams.id][$stateParams.num]);

      $scope.map = MapsSvc.CreateMapOriginDest(38.38, -0.51, 16);
      $scope.map.stroke = {
        color: '#387ef5',
        weight: 5
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