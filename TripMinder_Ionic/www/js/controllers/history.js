angular.module('tripminder')

.controller('HistoryCtrl', ['$scope', '$state', 'PersistenceSvc', 'RestSvc',
  function($scope, $state, PersistenceSvc, RestSvc) {



      $scope.$on('$ionicView.beforeEnter', function() {
          $scope.routes = PersistenceSvc.GetRoutesHistory();
      });


      $scope.config = {
          itemsDisplayed: 15
      };

      $scope.moreItemsCanBeAdded = function(){
          return $scope.routes.length > $scope.config.itemsDisplayed;
      };

      $scope.addItems = function(){
          $scope.config.itemsDisplayed += 15;
          $scope.$apply(function(){
              $scope.$broadcast('scroll.infiniteScrollComplete');
          });
      };

      $scope.Search = function(origin, dest, originCoords, destCoords){
          console.log(arguments);
          RestSvc.Search(origin, dest, originCoords, destCoords);
      };

      $scope.Clean = function(){
          console.log('en');
          $scope.routes = [];
          PersistenceSvc.DeleteAllRoutesHistory();
          console.log($scope.routes)
      };

      $scope.$on('search-complete', function(ev, args){
          $state.go('app.results');
      });
  }
]);