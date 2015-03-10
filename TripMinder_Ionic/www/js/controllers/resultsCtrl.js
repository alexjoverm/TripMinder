angular.module('tripminder')

    .controller('ResultsCtrl', ['$scope', '$timeout', 'DataSvc', 'MapsSvc',
        function ($scope, $timeout, DataSvc, MapsSvc) {

            $scope.searchResults = DataSvc.searchResults;
            console.log($scope.searchResults)

            $scope.map = MapsSvc.CreateDefaultResultMap();


            // **** Get polyline of map
            MapsSvc.promises.gMapsAPI.then(function () {

                $scope.map.polylines = {
                    car: null,
                    bicycling: null,
                    walking: null,
                    bus: null,
                    train: null,
                    plane: null
                }

                // Add polylines to $scope.map, one per each mean of transport
                Object.keys($scope.searchResults).forEach(function(key){
                    $scope.map.polylines[key] = [];

                    if(Array.isArray($scope.searchResults[key])) {
                        $scope.searchResults[key].forEach(function (route, i) {
                            $scope.map.polylines[key].push(
                                {
                                    path: MapsSvc.gMapsAPI.geometry.encoding.decodePath(route.polyline),
                                    stroke: (i == 0 ? $scope.map.strokeSelected : $scope.map.strokeDefault),
                                    zIndex: $scope.searchResults[key].length - i
                                }
                            );
                        });
                    }
                });

            });

        }
    ]);