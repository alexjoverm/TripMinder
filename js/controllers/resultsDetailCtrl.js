angular.module('tripminder')

.controller('ResultsDetailCtrl', ['$scope', '$stateParams', '$timeout', '$ionicScrollDelegate', 'DataSvc', 'MapsSvc',
  function($scope, $stateParams, $timeout, $ionicScrollDelegate, DataSvc, MapsSvc) {

      $scope.route = DataSvc.searchResults[$stateParams.id][$stateParams.num];

      $scope.$on('$ionicView.beforeEnter', function() {
          $scope.adress = DataSvc.adress;
      });


      console.log($scope.route);

      $scope.map = MapsSvc.CreateDefaultResultMap();

      $scope.config = {
          itemsDisplayed: 15
      };

      $scope.moreItemsCanBeAdded = function(){
          if($scope.route.steps)
            return $scope.route.steps.length > $scope.config.itemsDisplayed;
          else if($scope.route.flights)
            return $scope.route.flights.length > $scope.config.itemsDisplayed;
          else
            return false;
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
          if($scope.route && $scope.route.polyline)
              $scope.map.polyline = $scope.route.polyline;
      });
      
  }
]);