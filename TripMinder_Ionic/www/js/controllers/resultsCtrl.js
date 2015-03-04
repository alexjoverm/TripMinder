angular.module('tripminder')

.controller('ResultsCtrl', ['$scope', '$timeout', 'DataSvc', 'MapsSvc',
  function($scope, $timeout, DataSvc, MapsSvc) { 
      
      $scope.searchResults = DataSvc.searchResults;

      $scope.map = MapsSvc.CreateMapOriginDest(38.38, -0.51, 16);
      $scope.map.strokeDefault = {
        color: '#387ef5',
        weight: 4,
        opacity: 0.6
      };
      $scope.map.strokeSelected = {
        color: '#1aa595',
        weight: 6,
        opacity: 1
      };
      
      
      // **** Get polyline of map
      MapsSvc.promises.gMapsAPI.then(function(){ 
          
          if($scope.searchResults.car) 
              $scope.map.carPolylines = [];
        
              for(var i in $scope.searchResults.car){ 
                  var poli = MapsSvc.gMapsAPI.geometry.encoding.decodePath($scope.searchResults.car[i].polyline);
                  
                  console.log(i);
                  
                  // PROBAR A PONERLAS AL REVES Y CAMBIAR EL Z-INDEX EN EL EVENTO
                  
                  $scope.map.carPolylines.push(
                      {
                          path: poli,
                          stroke: (i == 0 ? $scope.map.strokeSelected : $scope.map.strokeDefault),
                          zIndex: $scope.searchResults.car.length - i
                      }
                  );
              }
          
              $timeout(function(){
                  var map = $scope.map.control.getGMap();
                  console.log(map);
              }, 400);
          
      });
      
  }
]);