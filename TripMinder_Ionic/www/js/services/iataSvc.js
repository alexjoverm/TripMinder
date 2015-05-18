function sortMatches(a,b) {
    if (a._count > b._count)
        return -1;
    if (a._count == b._count && a._length < b._length)
        return -1;
    if (a._count == b._count && a._length > b._length)
        return 1;
    if (a._count < b._count)
        return 1;

    return 0;
}

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
};


angular.module('tripminder.services', [])

    .factory('IATA', ['$http', function($http){

        var iata = null;

        var ToRadians = function(deg, min, sec, dir){
            return deg + min / 60 + sec / 3600 * (dir == 'S' || dir == 'W'? -1 : 1);
        };



        var return_obj = {

            GetIATA: function(index){
                return {
                    icao: iata.icao[index],
                    iata: iata.iata[index],
                    airport: iata.airport[index],
                    city: iata.city[index],
                    country: iata.country[index],
                    lat: iata.lat[index],
                    lon: iata.lon[index],
                    altitude: iata.altitude[index]
                };
            },

            Search: function(coords){

                //var arraux = [];
                //
                //for(var i = 0; i < iata.icao.length; i++)
                //    if(iata.iata[i][0] != 'Z' && iata.icao != "\\N")
                //        arraux.push({
                //            airport: iata.airport[i],
                //            city: iata.city[i],
                //            country: iata.country[i],
                //            iata: iata.iata[i],
                //            icao: iata.icao[i],
                //            lat: iata.lat[i],
                //            lon: iata.lon[i],
                //            altitude: iata.altitude[i]
                //        });
                //
                //console.log(JSON.stringify(arraux, null, 2));


                var result = [];

                var R = 6371; // Earth radius in km
                var max_results = 5;

                var lon1 = coords.longitude;
                var lat1 = coords.latitude;


                // Exhaustive search


                for(var i = 0; i < iata.icao.length; i++){

                    var lat2 = iata.lat[i];
                    var lon2 = iata.lon[i];

                    // Equirectangular approximation. Is working OK for small distances,
                    // but badly for bigger (4th closest airport to Alicante is in USA)

                 /*   var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
                    var y = lat2 - lat1;
                    var dist = Math.sqrt(x*x + y*y) * R;*/


                    // Harvensine

                    /*var dLat = (lat2-lat1).toRad();
                     var dLon = (lon2-lon1).toRad();

                     var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                     Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                     Math.sin(dLon/2) * Math.sin(dLon/2);
                     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                     var dist = R * c;*/


                    // Spherical law of cosines
                    var dLon = (lon2-lon1).toRad();
                    var dist = Math.acos( Math.sin(lat1.toRad()) * Math.sin(lat2.toRad()) +
                            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.cos(dLon) ) * R;

                    var obj = angular.copy(this.GetIATA(i));
                    obj.distance = dist;


                    if(result.length == 0)
                        result.push(obj);
                    else {
                        var inserted = false;
                        for (var j = 0; j < result.length && !inserted; j++)
                            if (obj.distance < result[j].distance && obj.iata != result[j].iata) {
                                result.splice(j, 0, obj);
                                inserted = true;

                                if(result.length >= max_results) result.pop();
                            }
                    }
                }




                // Equirectangular approximation

                /*var x = (λ2-λ1) * Math.cos((φ1+φ2)/2);
                var y = (φ2-φ1);
                var d = Math.sqrt(x*x + y*y) * R;*/


                // Harvensine

                /*
                var φ1 = lat1.toRadians();
                var φ2 = lat2.toRadians();
                var Δφ = (lat2-lat1).toRadians();
                var Δλ = (lon2-lon1).toRadians();

                var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                var d = R * c;*/



                return result;
            },


            // Called from app.js, in a "run" block when the app launch
            LoadData: function(){
                $http.get('js/static/IATA_codes.json').
                    success(function(data, status, headers, config) {
                        iata = data;
                    }).
                    error(function(data, status, headers, config) {
                        console.log(data);
                    });
            }


        };

        return return_obj;

    }]);