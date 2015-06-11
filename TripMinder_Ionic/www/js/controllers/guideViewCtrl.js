angular.module('tripminder')

    .controller('GuideViewCtrl', ['$scope', '$state', 'GuideSvc', 'MapsSvc',
        function($scope, $state, GuideSvc, MapsSvc) {

            $scope.guide = GuideSvc.guide;
            $scope.map = MapsSvc.CreateMapOriginDest(0, 0, 12);
            $scope.markers = [];

            for(var i in $scope.guide.places)
                $scope.markers.push(MapsSvc.CreateMarker(
                    $scope.markers.length,
                    $scope.guide.places[i].geometry.location.lat(),
                    $scope.guide.places[i].geometry.location.lng(),
                    $scope.guide.places[i].name
                ));

            $scope.GoToDetail = function(params){
                $state.go('app.guideDetail', params);
            };
        }
    ]);