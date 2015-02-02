angular.module('tripminder')

.controller('loadingSearchCtrl', ['$scope','RestCaller',
  function($scope, RestCaller) {
      $scope.icons = {
          directions: 'progress' // progress, done, fail
      };
      
      $scope.Cancel = function(){
          RestCaller.Cancel();
      };
      
      RestCaller.ChangeScope($scope.icons);
  }
]);