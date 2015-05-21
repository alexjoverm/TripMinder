angular.module('tripminder')

    .controller('ResultsCtrl', ['$scope', '$timeout', '$window', '$state', 'DataSvc', 'MapsSvc', 'RestSvc',
        function ($scope, $timeout, $window, $state, DataSvc, MapsSvc, RestSvc) {

            var CalculateHeight = function(){
                return (($window.innerHeight ||
                    document.documentElement.clientHeight  ||
                    document.body.clientHeight)
                    - (50 + 40 + 220) + 'px'); //margintop, topbar, tabbar, map
            };

            $scope.searchResults = DataSvc.searchResults;
            $scope.planeData = DataSvc.planeData;

            for(var i in $scope.planeData.origins)
                if(!$scope.planeData.origins[i].combobox)
                    $scope.planeData.origins[i].combobox = $scope.planeData.origins[i].city + ' - ' + $scope.planeData.origins[i].iata;

            for(var i in $scope.planeData.dests)
                if(!$scope.planeData.dests[i].combobox)
                    $scope.planeData.dests[i].combobox = $scope.planeData.dests[i].city + ' - ' + $scope.planeData.dests[i].iata;

            $scope.planeMarkers = [];



            $scope.map = MapsSvc.CreateDefaultResultMap();
            $scope.planeMap = MapsSvc.CreateMapOriginDest(38.38, -0.51, 16);




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

            $scope.GoToPlaneDetail = function(params){
                params.item = angular.toJson(params.item);
                $state.go('app.planeDetail', params);
            };

            $scope.SearchPlane = function(input){
                RestSvc.PlaneSearch(input.origin.iata, input.dest.iata).then(function(data){
                    if(data.trips.tripOption){
                        $scope.planeMarkers.push(MapsSvc.CreateCustomMarker(-1, input.origin.lat, input.origin.lon, input.origin.city + ' - ' + input.origin.iata));
                        $scope.planeMarkers.push(MapsSvc.CreateCustomMarker(-2, input.dest.lat, input.dest.lon, input.dest.city + ' - ' + input.dest.iata));
                        $scope.UpdateBounds();
                    }
                });
            };

            $scope.ClearPlane = function(){
                $scope.searchResults.plane = [];
                $scope.planeMarkers = [];
            };


            $scope.UpdateBounds = function(){

                MapsSvc.promises.gMapsAPI.then(function(){
                    if($scope.planeMarkers.length > 0){
                        $timeout(function() {
                            var map = $scope.planeMap.control.getGMap();
                            var bounds = new google.maps.LatLngBounds();

                            for (var i in $scope.planeMarkers){
                                var aux = new google.maps.LatLng(
                                    $scope.planeMarkers[i].coords.latitude,
                                    $scope.planeMarkers[i].coords.longitude
                                );
                                bounds.extend(aux);
                            }

                            map.fitBounds(bounds);
                        }, 100);
                    }

                });
            };



            $scope.InitPlaneMap = function(){
                if($scope.searchResults.plane && $scope.searchResults.plane.length > 0){
                    $scope.planeMarkers.push(MapsSvc.CreateCustomMarker(-1, $scope.planeData.origins[0].lat, $scope.planeData.origins[0].lon, $scope.planeData.origins[0].city + ' - ' + input.origin.iata));
                    $scope.planeMarkers.push(MapsSvc.CreateCustomMarker(-2, $scope.planeData.dests[0].lat, $scope.planeData.dests[0].lon, $scope.planeData.dests[0].city + ' - ' + input.dest.iata));

                    $scope.UpdateBounds();
                }
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
                            console.log(route)
                            if(route.polyline){
                                $scope.map.polylines[key].push(
                                    {
                                        path: route.polyline,
                                        stroke: (i == 0 ? $scope.map.strokeSelected : $scope.map.strokeDefault),
                                        zIndex: $scope.searchResults[key].length - i
                                    }
                                );
                            }
                        });
                    }
                });

            });

        }
    ]);