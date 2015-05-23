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

    .factory('RestSvc', ['$ionicLoading', 'ResourcesSvc', '$timeout', '$rootScope', 'DataSvc', 'Apis','IATA', 'googleDirections', 'PersistenceSvc',
        function ($ionicLoading, ResourcesSvc, $timeout, $rootScope, DataSvc, Apis, IATA, googleDirections, PersistenceSvc) {

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


                /*** Callers functions ***/

                this.Search = function (origin, dest, originCoord, destCoord) {

                    console.log(arguments)

                    // Init and reset ResourcesSvc and RestSvc promises, also DataSvc data
                    ResetVars();
                    DataSvc.ResetSearchVars();
                    DataSvc.adress = {
                        origin: origin.split(',')[0],
                        dest  : dest.split(',')[0]
                    };

                    //******** Perform API calls

                    var prefs = PersistenceSvc.GetPreferences();

                    var args = {
                        origin: originCoord.latitude + ',' + originCoord.longitude,
                        destination: destCoord.latitude + ',' + destCoord.longitude,
                        provideRouteAlternatives: true,
                        travelMode: 'driving',
                        unitSystem: prefs.unitSystem,
                        avoidHighways: prefs.avoidHighways,
                        avoidTolls: prefs.avoidTolls
                    };

                    console.log(prefs)
                    console.log(args)


                    // ** 1: Google Directions (CAR)

                    promises.car = googleDirections.getDirections(args);


                    promises.car.then(function (data) {
                        CheckFinished();
                        //Broadcast finished (true = success, false = failed)
                        $rootScope.$broadcast('search-finished', {car: true});
                        DataSvc.AddDirectionsRoutes('car', data.routes);
                    }, function (response) {
                        console.log(arguments);
                        if (response != 'ABORT') {
                            CheckFinished();
                            $rootScope.$broadcast(opt.mode, {car: false});
                        }
                    });


                    // ** 2: Google Directions (BICYCLING)
                    args.travelMode = 'bicycling';

                    promises.bicycling = googleDirections.getDirections(args);

                    promises.bicycling.then(function (data) {
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
                    args.travelMode = 'walking';

                    promises.walking = googleDirections.getDirections(args);

                    promises.walking.then(function (data) {
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
                    args.travelMode = 'transit';

                    promises.transit = googleDirections.getDirections(args);

                    promises.transit.then(function (data) {
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

                    DataSvc.planeData.lastOrigin = origin_obj[0];
                    DataSvc.planeData.lastDest = dest_obj[0];
                    DataSvc.planeData.date = new Date();

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

                    var dateAux = date.split('/');
                    date = new Date(parseInt(dateAux[2]), parseInt(dateAux[1]) - 1, parseInt(dateAux[0]));

                    var requestObj = angular.copy(Apis.qpxExpress.request);

                    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
                    date = new Date(date.getTime() - tzoffset);

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