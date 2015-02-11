angular.module('tripminder')

.controller('ResultsCtrl', ['$scope', '$timeout', 'DataSvc', 'MapsSvc',
  function($scope, $timeout, DataSvc, MapsSvc) { 
      
      $scope.searchResults = DataSvc.searchResults;

      $scope.map = MapsSvc.CreateMapOriginDest(38.38, -0.51, 16);
      $scope.map.stroke = {
        color: '#387ef5',
        weight: 4
      };
      
      //console.log($scope.searchResults.car[0].overview_polyline.points)
      
      /*MapsSvc.promises.gMapsAPI.then(function(){ 
          
          $scope.map.icons = [{
                icon: { 
                    path: MapsSvc.gMapsAPI.SymbolPath.FORWARD_OPEN_ARROW,
                    strokeColor: '#286de3',
                    scale: 3
                },
                offset: '25px',
                repeat: '60px'
          }];
          
          if($scope.searchResults && $scope.searchResults.car && $scope.searchResults.car[0]) 
              $scope.map.polyline = MapsSvc.gMapsAPI.geometry.encoding.decodePath($scope.searchResults.car[0].overview_polyline.points);
          
      });*/
      
  }
]);