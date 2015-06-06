angular.module('tripminder.services')

    .factory('PersistenceSvc', ['$window', function ($window) {

        var routePrefix = '_route--';
        var prefKey = '_preferences--';

        return {


            placetypes: {
                art       : ['art_gallery', 'museum'],
                amusement : ['amusement_park', 'aquarium', 'park', 'movie_theater', 'spa', 'stadium', 'zoo'],
                restaurant: ['cafe', 'meal_takeaway', 'restaurant'],
                nightlife : ['bar', 'casino', 'night_club'],
                fashion   : ['beauty_salon', 'hair_care'],
                shopping  : ['furniture_store', 'jewelry_store', 'shoe_store', 'shopping_mall', 'store'],
                religion  : ['cementery', 'church', 'hindu_temple', 'mosque', 'synagogue']
            },

            preferences: {
                unitSystem: 'metric',
                avoidHighways: false,
                avoidTolls: false,

                interests: {
                    art       : {
                        name  : 'Arte',
                        icon  : 'ion-paintbrush',
                        active: false
                    },
                    amusement : {
                        name  : 'Entretenimiento',
                        icon  : 'ion-android-happy',
                        active: false
                    },
                    restaurant: {
                        name  : 'Restaurantes',
                        icon  : 'ion-pizza',
                        active: false
                    },
                    nightlife : {
                        name  : 'Vida nocturna',
                        icon  : 'ion-beer',
                        active: false
                    },
                    fashion   : {
                        name  : 'Moda',
                        icon  : 'ion-bowtie',
                        active: false
                    },
                    shopping  : {
                        name  : 'Compras',
                        icon  : 'ion-bag',
                        active: false
                    },
                    religion  : {
                        name  : 'Religión',
                        icon  : 'ion-earth',
                        active: false
                    }
                }
            },

            AddRouteHistory       : function (origin, dest, originCoords, destCoords) {
                var key = routePrefix + origin + '-' + dest;
                var value = {
                    origin      : origin,
                    dest        : dest,
                    originCoords: originCoords,
                    destCoords  : destCoords,
                    date        : new Date().toISOString()
                };
                $window.localStorage[key] = angular.toJson(value);
            },
            GetRoutesHistory      : function () {
                var res = [];
                for (var key in $window.localStorage) {
                    if (key.indexOf(routePrefix) === 0) {
                        var obj = {key: key, value: angular.fromJson($window.localStorage[key] || '{}')};
                        if (obj != {}) obj.date = new Date(obj.date);
                        res.push(obj);
                    }
                }

                if (res.length > 0)
                    res.sort(function (a, b) {
                        return new Date(b.date) - new Date(a.date);
                    });

                return res;
            },
            DeleteRouteHistory    : function (key) {
                $window.localStorage.removeItem(key);
            },
            DeleteAllRoutesHistory: function () {
                for (var key in $window.localStorage)
                    if (key.indexOf(routePrefix) === 0) {
                        $window.localStorage.removeItem(key);
                    }
            },

            GetArrayPreferences: function(){
                var prefs = this.GetPreferences();
                var result = [];

                for (var property in prefs.interests)
                    if (prefs.interests.hasOwnProperty(property) && prefs.interests[property].active)
                        result.push(this.placetypes[property]);

                return _.flatten(result);
            },

            GetArrayPreferencesKeys: function(){
                var prefs = this.GetPreferences();
                var result = [];

                for (var property in prefs.interests)
                    if (prefs.interests.hasOwnProperty(property) && prefs.interests[property].active)
                        result.push(property);

                return result;
            },

            IsInCategory: function(types, type){
                for(var i in types)
                    if(this.placetypes[types[i]].indexOf(type) >= 0)
                        return { type: types[i], name: this.preferences.interests[types[i]].name, icon: this.preferences.interests[types[i]].icon };

                return false;
            },

            GetPreferences: function () {
                return angular.fromJson($window.localStorage[prefKey]) || angular.copy(this.preferences);
            },

            SetPreferences: function (preferences) {
                $window.localStorage[prefKey] = angular.toJson(preferences);
            }

        };
    }]);