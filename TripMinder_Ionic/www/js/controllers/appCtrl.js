angular.module('tripminder')

.controller('AppCtrl', ['$scope', '$ionicModal', '$ionicSideMenuDelegate', '$timeout', '$rootScope', 'MapsSvc',
  function($scope, $ionicModal, $ionicSideMenuDelegate, $timeout, $rootScope, MapsSvc) {
      // Form data for the login modal
      $scope.loginData = {};

      $scope.config = {
          currentState: ''
      };

      $rootScope.$on('$stateChangeSuccess', function(event, toState){
        $scope.config.currentState = toState.name;
      });


      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', { scope: $scope })
      .then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.login = function() {
        $scope.modal.show();
      };

      // Perform the login action when the user submits the login form
      $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
      };
      
      $scope.drag = MapsSvc.canDrag;
       
       $scope.$watch('drag', function(newValue, oldValue) { 
          $ionicSideMenuDelegate.canDragContent(newValue.menu);
       }, true);
}]);
