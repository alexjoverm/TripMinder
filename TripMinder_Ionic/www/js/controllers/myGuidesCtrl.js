angular.module('tripminder')

    .controller('MyGuidesCtrl', ['$scope', '$state', '$ionicHistory', 'MapsSvc','PersistenceSvc','GuideSvc',
        function($scope, $state, $ionicHistory, MapsSvc, PersistenceSvc, GuideSvc) {

            $scope.$on('$ionicView.beforeEnter', function() {
                GuideSvc.myGuides = PersistenceSvc.GetGuideHistory();
                $scope.guides = GuideSvc.myGuides;
                console.log($scope.guides)
            });




        }
    ]);