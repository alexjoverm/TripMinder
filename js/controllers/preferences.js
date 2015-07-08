angular.module('tripminder')

.controller('PreferencesCtrl', ['$scope', '$state', 'PersistenceSvc', 'GuideSvc',
  function($scope, $state, PersistenceSvc, GuideSvc) {

      $scope.radioButtons = {
         units: {
             values: ['metric', 'imperial'],
             texts: ['Kilómetros', 'Millas']
         }
      };

      $scope.rankBy = {
        prominence: google.maps.places.RankBy.PROMINENCE,
          distance: google.maps.places.RankBy.DISTANCE
      };

      $scope.$on('$ionicView.beforeEnter', function() {
          $scope.preferences = PersistenceSvc.GetPreferences();
      });

      $scope.Update = function(changeCoord){
          PersistenceSvc.SetPreferences($scope.preferences);
          if(changeCoord){
              GuideSvc.oldCoords.latitude  = 0;
              GuideSvc.oldCoords.longitude = 0;
          }
      };
  }
]);