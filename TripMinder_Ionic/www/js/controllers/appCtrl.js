angular.module('tripminder')

.controller('AppCtrl', ['$scope', '$ionicModal', '$ionicSideMenuDelegate', '$timeout', '$rootScope', 'MapsSvc',
  function($scope, $ionicModal, $ionicSideMenuDelegate, $timeout, $rootScope, MapsSvc) {

      $scope.config = {
          currentState: ''
      };

      $rootScope.$on('$stateChangeSuccess', function(event, toState){
        $timeout(function(){ $scope.config.currentState = toState.name; }, 1010);
      });


      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', { scope: $scope })
      .then(function(modal) {
        $scope.modal = modal;
      });

      
      $scope.drag = MapsSvc.canDrag;
       
       $scope.$watch('drag', function(newValue, oldValue) { 
          $ionicSideMenuDelegate.canDragContent(newValue.menu);
       }, true);
}]);
