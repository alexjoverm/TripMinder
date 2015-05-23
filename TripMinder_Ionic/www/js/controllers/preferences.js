angular.module('tripminder')

.controller('PreferencesCtrl', ['$scope', '$state', 'PersistenceSvc',
  function($scope, $state, PersistenceSvc) {

      $scope.radioButtons = {
         units: {
             values: ['metric', 'imperial'],
             texts: ['Kilómetros', 'Millas']
         }
      };

      $scope.$on('$ionicView.beforeEnter', function() {
          $scope.preferences = PersistenceSvc.GetPreferences();
      });

      $scope.Update = function(){
          PersistenceSvc.SetPreferences($scope.preferences);
      };
  }
]);