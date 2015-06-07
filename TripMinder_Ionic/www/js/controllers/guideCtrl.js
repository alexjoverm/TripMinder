angular.module('tripminder')

    .controller('GuideCtrl', ['$scope','DataSvc','GuideSvc',
        function($scope, DataSvc, GuideSvc) {

            $scope.address = DataSvc.adress;

            $scope.$on('$ionicView.beforeEnter', function() {
                GuideSvc.GetPlaces();
                $scope.places = GuideSvc.places;
            });

            $scope.$on('GuideSvc:loaded', function(){
                $scope.places = GuideSvc.places;
            });

            $scope.calculateTrack = function(index){
                console.log(index + (GuideSvc.numSearches * 10))
                return index + (GuideSvc.numSearches * 10);
            };
        }
    ]);