angular.module('tripminder')

.controller('loadingSearchCtrl', ['$scope','RestSvc',
  function($scope, RestSvc) {
      $scope.icons = {
          directions: null // null, true, false
      };
      
      $scope.Cancel = function(){
          RestSvc.Cancel();
      };
      
      
      
      // Updates the icons (var names must be equal)
      
      var searchEv = $scope.$on('search-finished', function(event, args){ 
          for (var key in args)
              if (args.hasOwnProperty(key))
                  $scope.icons[key] = args[key];
      });
      
      
      
      // Free memory and unlink (hacky, but prevents the events from being called multiple times)
      
      var loadingEv = $scope.$on('loading-closed', function(){
          searchEv();
          loadingEv();
      });
  }
]);