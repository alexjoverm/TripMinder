angular.module('tripminder')

.controller('ResultsDetailCtrl', ['$scope', '$stateParams', '$timeout', '$ionicScrollDelegate', 'DataSvc', 'MapsSvc',
  function($scope, $stateParams, $timeout, $ionicScrollDelegate, DataSvc, MapsSvc) {

      $scope.route = DataSvc.searchResults[$stateParams.id][$stateParams.num];
      $scope.adress = DataSvc.adress;

      $scope.map = MapsSvc.CreateDefaultResultMap();

      $scope.config = {
          itemsDisplayed: 15
      };

      $scope.moreItemsCanBeAdded = function(){
          return $scope.route.steps.length > $scope.config.itemsDisplayed;
      };

      $scope.addItems = function(){
          $scope.config.itemsDisplayed += 15;
          //$ionicScrollDelegate.resize();
          //console.log($scope.route.steps.length + '  ' + $scope.config.itemsDisplayed);
          $scope.$apply(function(){
              $scope.$broadcast('scroll.infiniteScrollComplete');
          });
      };



      // **** Get polyline of map
      MapsSvc.promises.gMapsAPI.then(function(){ 
          
          // COMPROBAR SI PROVIENE DE GOOGLE MAPS O ES UNA LINEA DE PUNTOS
          if($scope.route) 
              $scope.map.polyline = MapsSvc.gMapsAPI.geometry.encoding.decodePath($scope.route.polyline);
      });
      
  }
]);