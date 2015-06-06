angular.module('tripminder')

    .controller('GuideCtrl', ['$scope','DataSvc','GuideSvc',
        function($scope, DataSvc, GuideSvc) {

            $scope.address = DataSvc.adress;

            $scope.$on('$ionicView.beforeEnter', function() {
                GuideSvc.GetPlaces();
                $scope.places = GuideSvc.places;
            });
        }
    ]);