angular.module('tripminder')

.controller('GuideDetailCtrl', ['$scope', '$stateParams', 'MapsSvc', 'ngGPlacesAPI',
  function($scope, $stateParams, MapsSvc, ngGPlacesAPI) {

      $scope.map = MapsSvc.CreateDefaultResultMap();

      ngGPlacesAPI.placeDetails({reference: $stateParams.id}).then(function (data) {
          $scope.place data;
      });
      
  }
]);