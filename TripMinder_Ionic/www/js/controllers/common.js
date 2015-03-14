angular.module('tripminder')

.controller('loadingSearchCtrl', ['$scope','RestSvc',
  function($scope, RestSvc) {
      $scope.routes = [
          {
              id: 'car',
              text: "En coche",
              icon: null  // null, true, false
          },
          {
              id: 'bicycling',
              text: "En bicicleta",
              icon: null
          },
          {
              id: 'walking',
              text: "Andando",
              icon: null
          },
          {
              id: 'bus',
              text: "En bus",
              icon: null
          },
          {
              id: 'train',
              text: "En tren",
              icon: null
          }/*,
          {
              id: 'plane',
              text: "En avión",
              icon: null
          }*/
      ];
      
      $scope.Cancel = function(){
          RestSvc.Cancel();
      };
      
      
      
      // Updates the icons (var names must be equal)
      var searchEv = $scope.$on('search-finished', function(event, args){
          $scope.routes.forEach(function(route){
              if(Object.keys(args).indexOf(route.id) != -1)
                  route.icon = Object.keys(args)[0];
          });
      });
      
      
      // Free memory and unlink (hacky, but prevents the events from being called multiple times)
      var loadingEv = $scope.$on('loading-closed', function(){
          searchEv();
          loadingEv();
      });
  }
]);