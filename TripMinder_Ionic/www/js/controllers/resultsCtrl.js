angular.module('tripminder')

.controller('ResultsCtrl', ['$scope', 'DataSvc',
  function($scope, DataSvc) { 
      
      console.log(DataSvc.searchResults);
      
      $scope.searchResults = {
          car: DataSvc.searchResults
      };
      
  }
]);