angular.module('tripminder')

    .controller('GuideCtrl', ['$scope','DataSvc','GuideSvc','$state',
        function($scope, DataSvc, GuideSvc, $state) {

            $scope.address = DataSvc.adress;

            $scope.$on('$ionicView.beforeEnter', function() {
                GuideSvc.GetPlaces();
                $scope.places = GuideSvc.places;
                console.log($scope.places)
            });

            $scope.$on('GuideSvc:loaded', function(){
                $scope.places = GuideSvc.places;
                console.log($scope.places)
            });


            $scope.calculateTrack = function(index){
                console.log(index + (GuideSvc.numSearches * 10))
                return index + (GuideSvc.numSearches * 10);
            };

            $scope.GoToDetail = function(params){
                console.log(params)
                $state.go('app.guideDetail', params);
            };
        }
    ]);