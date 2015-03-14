angular.module('tripminder')

    .controller('ResultsCtrl', ['$scope', '$timeout', '$window', '$state', 'DataSvc', 'MapsSvc',
        function ($scope, $timeout, $window, $state, DataSvc, MapsSvc) {

            var CalculateHeight = function(){
                return (($window.innerHeight ||
                    document.documentElement.clientHeight  ||
                    document.body.clientHeight)
                    - (50 + 40 + 220) + 'px'); //margintop, topbar, tabbar, map
            }

            $scope.searchResults = DataSvc.searchResults;


            $scope.map = MapsSvc.CreateDefaultResultMap();

            // Height for ion-scroll
            $scope.win_height = {
                height: CalculateHeight()
            };

            angular.element($window).bind('resize', function() {
                $scope.win_height.height = CalculateHeight();
                $scope.$apply();
            });


            $scope.GoToDetail = function(params){
                params.item = angular.toJson(params.item);
                $state.go('app.resultsDetail', params);
            };


            // **** Get polyline of map
            MapsSvc.promises.gMapsAPI.then(function () {

                $scope.map.polylines = {
                    car: null,
                    bicycling: null,
                    walking: null,
                    bus: null,
                    train: null,
                    plane: null
                };

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