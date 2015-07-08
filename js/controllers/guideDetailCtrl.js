angular.module('tripminder')

.controller('GuideDetailCtrl', ['$scope', '$stateParams', 'MapsSvc', 'ngGPlacesAPI', 'GuideSvc',
  function($scope, $stateParams, MapsSvc, ngGPlacesAPI, GuideSvc) {



      ngGPlacesAPI.placeDetails({placeId: $stateParams.id, language: 'es'}).then(function (data) {
          $scope.place = data;
          GuideSvc.ProcessDetail($scope.place);
          var lat = $scope.place.geometry.location.lat();
          var lng = $scope.place.geometry.location.lng();
          $scope.map = MapsSvc.CreateMapOriginDest(lat, lng, 15);
      });
      
  }
]);