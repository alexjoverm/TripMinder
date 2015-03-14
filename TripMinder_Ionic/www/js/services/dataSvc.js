angular.module('tripminder.services')

    .factory('DataSvc',
    function () {

        var transit_types = {
            bus      : ["BUS", "INTERCITY_BUS", "TROLLEYBUS", "SHARE_TAXI"],
            train    : ["RAIL", "METRO_RAIL", "SUBWAY", "TRAM", "MONORAIL", "HEAVY_RAIL", "COMMUTER_TRAIN", "HIGH_SPEED_TRAIN"],
            ferry    : ["FERRY"],
            cable_car: ["CABLE_CAR", "GONDOLA_LIFT", "FUNICULAR"],
            walking  : ["WALKING"],
            car      : ["DRIVING"],
            bicycling: ["BICYCLING"]
        };

        // Simplify vehicle var and return the simplified key chosen
        var simplifyVehicle = function (line) {
            Object.keys(transit_types).forEach(function (key) {
                if (transit_types[key].indexOf(line.vehicle.type) >= 0)
                    line.vehicle = key;
            });
            return line.vehicle;
        };

        // Change title and add main vehicle just to sort it somwhere
        var processTransitSteps = function (route) {
            var changed = {
                title  : false,
                vehicle: false
            };
            var chosenVehicle = 'train';

            route.vehicles = [];

            route.steps.forEach(function (step) {
                if (step.transit_details) {
                    // Try to find the agency name
                    if (!changed.title && Array.isArray(step.transit_details.line.agencies)) {
                        route.title = step.transit_details.line.agencies[0].name;
                        changed.title = true;
                    }

                    // Simplify vehicle type
                    var vType = simplifyVehicle(step.transit_details.line);

                    if (route.vehicles.indexOf(vType) < 0)
                        route.vehicles.push(vType);

                    // Decide if bus or train (Criterion: first found in steps.transit_details.line.vehicle.type
                    if (!changed.vehicle && typeof vType == "string") {
                        chosenVehicle = vType;
                        changed.vehicle = true;
                    }
                }
                else {
                    if (route.vehicles.indexOf(step.travel_mode.toLowerCase()) < 0)
                        route.vehicles.push(step.travel_mode.toLowerCase());
                }
            });

            route.main_vehicle = chosenVehicle;
        };


        var datakeeper = new function () {


            // ******* SEARCH

            this.searchResults = {
                car      : null,
                bicycling: null,
                walking  : null,
                bus      : null,
                train    : null,
                plane    : null
            };

            this.adress = null;

            this.ResetSearchVars = function () {
                for (var prop in datakeeper.searchResults)
                    if (datakeeper.searchResults.hasOwnProperty(prop))
                        datakeeper.searchResults[prop] = null;
            };

            this.AddDirectionsRoutes = function (mode, arr) {
                datakeeper.searchResults[mode] = [];

                if (arr.length > 3)
                    arr.length = 3;

                for (var i in arr) {
                    var obj = {
                        title         : arr[i].summary,
                        distance      : arr[i].legs[0].distance,
                        duration      : arr[i].legs[0].duration,
                        start_adress  : arr[i].legs[0].start_adress,
                        end_adress    : arr[i].legs[0].end_adress,
                        start_location: arr[i].legs[0].start_location,
                        end_location  : arr[i].legs[0].end_location,
                        steps         : arr[i].legs[0].steps,
                        polyline      : arr[i].overview_polyline.points
                    }

                    datakeeper.searchResults[mode].push(obj);
                }
            }

            this.AddTransitRoutes = function (arr) {
                datakeeper.searchResults['bus'] = [];
                datakeeper.searchResults['train'] = [];

                arr.forEach(function (route) {
                    var title = route.legs[0].start_address.split(',')[0] + ' - ' + route.legs[0].end_address.split(',')[0];

                    var obj = {
                        title         : title,
                        distance      : route.legs[0].distance,
                        duration      : route.legs[0].duration,
                        start_adress  : route.legs[0].start_adress,
                        end_adress    : route.legs[0].end_adress,
                        start_location: route.legs[0].start_location,
                        end_location  : route.legs[0].end_location,
                        steps         : route.legs[0].steps,
                        polyline      : route.overview_polyline.points
                    };

                    processTransitSteps(obj);
                    datakeeper.searchResults[obj.main_vehicle].push(obj);
                });
            }
        }

        return datakeeper;
    }
);