angular.module('tripminder.services')

    .factory('PersistenceSvc', ['$window', function($window) {

        var routePrefix = '_route--';
        var prefKey = '_preferences--';

        return {

            placetypes: {
                art: ['art_gallery', 'museum'],
                amusement: ['amusement_park', 'aquarium', 'park', 'movie_theater', 'spa', 'stadium', 'zoo'],
                restaurant: ['cafe','meal_takeaway', 'restaurant'],
                nightlife: ['bar', 'casino', 'night_club'],
                food: ['bakery', 'food'],
                fashion: ['beauty_salon', 'hair_care'],
                shopping: ['furniture_store', 'jewelry_store', 'shoe_store', 'shopping_mall', 'store'],
                religion: ['cementery', 'church', 'hindu_temple', 'mosque', 'synagogue']
            },

            preferences: {
                art: false,
                amusement: false,
                restaurant: false,
                nightlife: false,
                food: false,
                fashion: false,
                shopping: false,
                religion: false
            },

            AddRouteHistory: function(origin, dest, originCoords, destCoords){
                var key = routePrefix + origin + '-' + dest;
                var value = { origin: origin, dest: dest, originCoords: originCoords, destCoords: destCoords, date: new Date().toISOString() };
                $window.localStorage[key] = angular.toJson(value);
            },
            GetRoutesHistory: function(){
                var res = [];
                for (var key in $window.localStorage){
                    console.log(key)
                    if(key.indexOf(routePrefix) === 0){
                        var obj = { key: key, value: angular.fromJson($window.localStorage[key] || '{}') };
                        if(obj != {}) obj.date = new Date(obj.date);
                        res.push(obj);
                    }
                }

                if(res.length > 0)
                    res.sort(function(a,b){
                        return new Date(b.date) - new Date(a.date);
                    });

                return res;
            },
            DeleteRouteHistory: function(key){
                $window.localStorage.removeItem(key);
            },
            DeleteAllRoutesHistory: function(){
                for (var key in $window.localStorage)
                    if(key.indexOf(routePrefix) === 0){
                        $window.localStorage.removeItem(key);
                    }
            },


            GetPreferences: function(){

                return angular.fromJson($window.localStorage[prefKey]) || angular.copy(this.preferences);
            },

            SetPreferences: function(preferences){
                $window.localStorage[prefKey] = angular.toJson(preferences);
            }

        };
    }]);