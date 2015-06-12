angular.module('tripminder')

    .controller('MyGuidesDetailCtrl', ['$scope', '$stateParams', 'GuideSvc', 'MapsSvc','PersistenceSvc',
        function($scope, $stateParams, GuideSvc, MapsSvc, PersistenceSvc) {

            $scope.guide = GuideSvc.myGuides[$stateParams.id];
            $scope.map = MapsSvc.CreateMapOriginDest(0, 0, 12);
            $scope.markers = [];

            console.log($scope.guide)

            for(var i in $scope.guide.places)
                $scope.markers.push(MapsSvc.CreateMarker(
                    $scope.markers.length,
                    $scope.guide.places[i].latitude,
                    $scope.guide.places[i].longitude,
                    $scope.guide.places[i].name
                ));


            $scope.Update = function(){
            };
        }
    ]);