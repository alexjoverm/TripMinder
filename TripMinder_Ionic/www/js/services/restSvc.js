angular.module('tripminder.services')


/*******
 -- ResourcesSvc -- : it performs the ajax API calls and keep a range of cancellers promises
 in order to can cancel the requests externally
 ********/

    .factory('ResourcesSvc', ['RequestFactory', 'Apis',
        function (RequestFactory, Apis) {

            var resources = new function () {

                //**** API callers

                this.GoAutocomplete = RequestFactory.createResource({
                    url    : Apis.goAutocomplete.url,
                    options: {input: '@input', types: '@types', key: Apis.google.key},
                    actions: {get: {method: 'GET'}}
                });

                this.GoDirections = RequestFactory.createResource({
                    url    : Apis.goDirections.url,
                    options: {
                        origin      : '@origin',
                        destination : '@destination',
                        sensor      : 'false',
                        mode        : '@mode',
                        alternatives: '@alternatives',
                        avoid       : '@avoid'
                    },
                    actions: {get: {method: 'GET'}}
                });

                this.QPXExpress = RequestFactory.createResource({
                    url    : Apis.qpxExpress.url,
                    options: {key: Apis.google.key},
                    actions: {myPost: {method: 'POST'}}
                });
            };


            return resources;
        }])


/*******
 -- RestSvc --: uses the ResourcesSvc factory to perform more complex calls. Notify through
 $rootScope.$broadcast about changes and provides an intermediate layer between
 the controllers and ResourcesSvc.
 ********/

    .factory('RestSvc', ['$ionicLoading', 'ResourcesSvc', '$timeout', '$rootScope', 'DataSvc', 'Apis','IATA',
        function ($ionicLoading, ResourcesSvc, $timeout, $rootScope, DataSvc, Apis, IATA) {

            // ** Private

            var promises = {
                car      : null,
                bicycling: null,
                walking  : null,
                transit  : null,
                plane    : null
            };

            var calls = {
                done : 0,
                total: 5
            };

            var CloseLoading = function (delay) {
                $timeout(function () {
                    $ionicLoading.hide();
                    $rootScope.$broadcast('loading-closed');
                }, delay);
            };

            var ResetVars = function () {
                for (var prop in promises)
                    if (promises.hasOwnProperty(prop))
                        promises[prop] = null;

                for (var prop in restcaller.data)
                    if (restcaller.data.hasOwnProperty(prop))
                        restcaller.data[prop] = null;

                calls.done = 0;
            };

            var CheckFinished = function () {
                calls.done++;
                if (calls.done == calls.total)
                    Finish();
            };

            var Finish = function () {
                $rootScope.$broadcast('search-complete');
                CloseLoading(1000);
            };


            // ** Public

            var restcaller = new function () {


                /*** Auxiliar functions ***/

                this.IsFinished = function () {
                    return calls.done == calls.total;
                };

                this.Cancel = function () {
                    for (var prop in promises)
                        if (promises.hasOwnProperty(prop))
                            promises[prop].abort();

                    CloseLoading(0);
                };


                /*** Callers functions ***/

                this.Search = function (origin, dest, originCoord, destCoord) {

                    // Init and reset ResourcesSvc and RestSvc promises, also DataSvc data
                    ResetVars();
                    DataSvc.ResetSearchVars();
                    DataSvc.adress = {
                        origin: origin.split(',')[0],
                        dest  : dest.split(',')[0]
                    };

                    //******** Perform API calls

                    // ** 1: Google Directions (CAR)
                    var opt = {
                        origin      : origin,
                        destination : dest,
                        alternatives: true,
                        mode        : 'driving'
                    }

                    promises.car = ResourcesSvc.GoDirections.get(opt);

                    promises.car.promise.then(function (data) {
                        CheckFinished();
                        //Broadcast finished (true = success, false = failed)
                        $rootScope.$broadcast('search-finished', {car: true});
                        DataSvc.AddDirectionsRoutes('car', data.routes);
                    }, function (response) {
                        if (response != 'ABORT') {
                            CheckFinished();
                            $rootScope.$broadcast(opt.mode, {car: false});
                        }
                    });


                    // ** 2: Google Directions (BICYCLING)
                    opt.mode = 'bicycling';

                    promises.bicycling = ResourcesSvc.GoDirections.get(opt);

                    promises.bicycling.promise.then(function (data) {
                        CheckFinished();
                        $rootScope.$broadcast('search-finished', {bicycling: true});
                        DataSvc.AddDirectionsRoutes('bicycling', data.routes);
                    }, function (response) {
                        if (response != 'ABORT') {
                            CheckFinished();
                            $rootScope.$broadcast('search-finished', {bicycling: false});
                        }
                    });


                    // ** 3: Google Directions (WALKING)
                    opt.mode = 'walking';

                    promises.walking = ResourcesSvc.GoDirections.get(opt);

                    promises.walking.promise.then(function (data) {
                        CheckFinished();
                        $rootScope.$broadcast('search-finished', {walking: true});
                        DataSvc.AddDirectionsRoutes('walking', data.routes);
                    }, function (response) {
                        if (response != 'ABORT') {
                            CheckFinished();
                            $rootScope.$broadcast('search-finished', {walking: false});
                        }
                    });


                    // ** 4: Google Transit (TRAIN & BUS)
                    opt.mode = 'transit';
                    opt.departure_time = Math.round(new Date().getTime() / 1000.0);

                    promises.transit = ResourcesSvc.GoDirections.get(opt);

                    promises.transit.promise.then(function (data) {
                        CheckFinished();
                        $rootScope.$broadcast('search-finished', {train: true});
                        $rootScope.$broadcast('search-finished', {bus: true});


                        // Add TRAIN & BUS routes (they are in the same reply)
                        DataSvc.AddTransitRoutes(data.routes);

                    }, function (response) {
                        if (response != 'ABORT') {
                            CheckFinished();
                            $rootScope.$broadcast('search-finished', {train: false});
                            $rootScope.$broadcast('search-finished', {bus: false});
                        }
                    });


                    // ** 5: QPX Express (PLANE)



                    // Find Origin and Dest IATA name
                    var origin_obj = IATA.Search(originCoord);
                    var dest_obj = IATA.Search(destCoord);

                    DataSvc.planeData.origins = origin_obj;
                    DataSvc.planeData.dests = dest_obj;
                    console.log(DataSvc.planeData);

                    if(origin_obj.length && dest_obj.length){

                        var requestObj = angular.copy(Apis.qpxExpress.request);
                        requestObj.request.slice[0].date = (new Date()).toISOString().slice(0, 10);

                        // For now ONLY FIRST OCCURRENCE
                        requestObj.request.slice[0].origin = origin_obj[0].iata;
                        requestObj.request.slice[0].destination = dest_obj[0].iata;



                        promises.plane = ResourcesSvc.QPXExpress.myPost(JSON.stringify(requestObj));

                        promises.plane.promise.then(function (data) {
                            CheckFinished();
                            $rootScope.$broadcast('search-finished', {plane: true});

                            DataSvc.AddPlaneRoutes(data);
                        }, function (response) {
                            if (response != 'ABORT') {
                                CheckFinished();
                                $rootScope.$broadcast('search-finished', {plane: false});
                            }
                        });
                    }
                    else{
                        CheckFinished();
                        $rootScope.$broadcast('search-finished', {plane: false});
                    }



                    // Show loading screen
                    $ionicLoading.show({
                        templateUrl: 'templates/partials/loadingSearch.html'
                    });
                };

                this.PlaneSearch = function(origin, dest, date){

                    if(!date) date = new Date();

                    var requestObj = angular.copy(Apis.qpxExpress.request);
                    requestObj.request.slice[0].date = date.toISOString().slice(0, 10);

                    // For now ONLY FIRST OCCURRENCE
                    requestObj.request.slice[0].origin = origin;
                    requestObj.request.slice[0].destination = dest;

                    promises.plane = ResourcesSvc.QPXExpress.myPost(JSON.stringify(requestObj));

                    promises.plane.promise.then(function (data) {
                        DataSvc.AddPlaneRoutes(data);
                    }, function (response) {
                        console.log(arguments);
                    });

                    return promises.plane.promise;
                }
            };


            return restcaller;
        }])