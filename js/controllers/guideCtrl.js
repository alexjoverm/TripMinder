angular.module('tripminder')

    .controller('GuideCtrl', ['$scope', '$rootScope', '$state', 'DataSvc','GuideSvc','$state',
        function($scope, $rootScope, $state, DataSvc, GuideSvc, $state) {


            $scope.selected = GuideSvc.selected;

            $scope.$on('$ionicView.beforeEnter', function() {
                GuideSvc.GetPlaces();
                $scope.places = GuideSvc.places;
                $scope.$broadcast('updateTabs');
                $scope.address = DataSvc.adress;
            });

            $scope.$on('GuideSvc:loaded', function(){
                $scope.places = GuideSvc.places;
            });


            $scope.GoToDetail = function(params){
                $state.go('app.guideDetail', params);
            };

            $scope.AddOrRemove = function(item){
                if(item.selected)
                    $scope.selected.push(item);
                else
                    _.remove($scope.selected, { 'place_id': item.place_id });
            };

            $scope.CreateGuide = function(){
                GuideSvc.guide.address = angular.copy($scope.address);
                GuideSvc.guide.places = angular.copy($scope.selected);
                $state.go('app.guideView');
            };
        }
    ]);