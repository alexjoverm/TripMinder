angular.module('tripminder')

.controller('PreferencesCtrl', ['$scope', '$state', 'PersistenceSvc',
  function($scope, $state, PersistenceSvc) {

      $scope.$on('$ionicView.beforeEnter', function() {
          $scope.preferences = PersistenceSvc.GetPreferences();
      });

      $scope.Update = function(){
          PersistenceSvc.SetPreferences($scope.preferences);
      };
  }
]);