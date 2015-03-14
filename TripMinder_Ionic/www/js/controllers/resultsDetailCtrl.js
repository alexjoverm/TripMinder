angular.module('tripminder')

.controller('ResultsDetailCtrl', ['$scope', '$stateParams', '$timeout', 'DataSvc', 'MapsSvc',
  function($scope, $stateParams, $timeout, DataSvc, MapsSvc) { 

      $scope.route = DataSvc.searchResults[$stateParams.id][$stateParams.num];
      $scope.adress = DataSvc.adress;

      $scope.map = MapsSvc.CreateDefaultResultMap();
      
      // **** Get polyline of map
      MapsSvc.promises.gMapsAPI.then(function(){ 
          
          // COMPROBAR SI PROVIENE DE GOOGLE MAPS O ES UNA LINEA DE PUNTOS
          if($scope.route) 
              $scope.map.polyline = MapsSvc.gMapsAPI.geometry.encoding.decodePath($scope.route.polyline);
      });
      
  }
]);