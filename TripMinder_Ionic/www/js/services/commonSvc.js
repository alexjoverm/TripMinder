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


angular.module('tripminder.services', [])

    .factory('LocalStorage', ['$window', function($window) {
        return {
            Set: function(key, value) {
                $window.localStorage[key] = value;
            },
            Get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            SetObject: function(key, value) {
                $window.localStorage[key] = angular.toJson(value);
            },
            GetObject: function(key) {
                return angular.fromJson($window.localStorage[key] || '{}');
            }
        };
    }])


    .factory('IATA', ['$http', function($http){

        var iata = null;

        var return_obj = {

            GetIATA: function(index){
                return {
                    city: iata.city[index],
                    country: iata.country[index],
                    code: iata.code[index]
                }
            },

            Search: function(input){

                var found = false;
                var result = {
                    match : null, // {code, city, country}
                    other_matches: [] // position, occurrences, string
                };

                // First split by ',' and try to find the exact match
                var first_arr = input.trim().toLowerCase().split(',');


                // *** Searching Algorithm

                for(var i=0; i < iata.city.length && !found; i++){
                    if(iata.city[i] == first_arr[0] || (first_arr.length > 1 && iata.city[i] == first_arr[1])){
                        result.match = { pos: i };
                        result.other_matches = null;
                        found = true;
                    }
                    else{
                        // If not, in the same loop, try to find occurrences, splitting
                        // by ' ' and adding the number of matches and position to an array
                        for(var j=0; j < first_arr.length; j++){
                            var second_arr = first_arr[j].split(' ');
                            var count_ocurrences = 0;

                            for(var k=0; k < second_arr.length; k++){
                                if(second_arr[k].length > 3){
                                    if(iata.city[i].indexOf(second_arr[k]) >= 0)
                                        count_ocurrences++;
                                }
                            }

                            if(count_ocurrences > 0)
                                result.other_matches.push({pos: i, _count: count_ocurrences, _length: iata.city[i].length})
                        }

                    }
                }


                // Select best match
                if(result.match)
                    result.bestMatch = {
                        city: iata.city[result.match.pos],
                        country: iata.country[result.match.pos],
                        code: iata.code[result.match.pos]
                    }
                else if(result.other_matches.length > 0) {
                    result.other_matches.sort(sortMatches);
                    result.bestMatch = {
                        city: iata.city[result.other_matches[0].pos],
                        country: iata.country[result.other_matches[0].pos],
                        code: iata.code[result.other_matches[0].pos]
                    }
                }



                return result;

            },


            // Called from app.js, in a "run" block when the app launch
            LoadData: function(){
                $http.get('js/static/IATA_codes.json').
                    success(function(data, status, headers, config) {
                        iata = data;
                        console.log(iata);
                    }).
                    error(function(data, status, headers, config) {
                        console.log(data);
                    });
            }


        }

        return return_obj;

    }]);