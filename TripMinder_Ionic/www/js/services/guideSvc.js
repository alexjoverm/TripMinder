angular.module('tripminder.services')

    .factory('GuideSvc', ['$rootScope', '$ionicPopup', '$state', '$ionicLoading', 'DataSvc', 'PersistenceSvc', 'ngGPlacesAPI',
        function ($rootScope, $ionicPopup, $state, $ionicLoading, DataSvc, PersistenceSvc, ngGPlacesAPI) {

        var calculateDistance = function(lat1, lon1, lat2, lon2){
            // Spherical law of cosines
            var dLon = (lon2-lon1).toRad();
            return Math.acos( Math.sin(lat1.toRad()) * Math.sin(lat2.toRad()) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.cos(dLon) ) * 6371.0;
        };


        var addCategory = function(types, item){
            for (var i in item.types) {
                var cat = PersistenceSvc.IsInCategory(types, item.types[i]);
                if(cat) {
                    item.category = cat;
                    delete types;
                    return cat.type;
                }
            }
        };

        var addStars = function(item){
            if(item.rating){
                var _stars = [];
                var _num = parseFloat(item.rating);
                var _rounded = Math.round(_num * 2) / 2;
                var _intPart = parseInt(_rounded);
                var _decPart = (_rounded - _intPart) * 10;
                var _restPart = 5 - _intPart;

                for(var i=0; i < _intPart; i++) _stars.push('ion-android-star');
                if(_decPart == 5){
                    _stars.push('ion-android-star-half');
                    _restPart--;
                }
                for(var i=0; i < _restPart; i++) _stars.push('ion-android-star-outline');

                item.stars = _stars;
            }
        };

        var processResults = function(data){

            var _types = PersistenceSvc.GetArrayPreferencesKeys();

            for(var i in data){
                // Retrieve images
                if(data[i].photos && data[i].photos.length > 0) {
                    data[i].photo = data[i].photos[0].getUrl({'maxWidth': 700, 'maxHeight': 500});
                    delete data[i].photos;
                }
                // Calculate distance to the address center
                data[i].distance = calculateDistance(data[i].geometry.location.lat(), data[i].geometry.location.lng(),
                                        DataSvc.adress.dest.coord.latitude, DataSvc.adress.dest.coord.longitude);


                addStars(data[i]);

                // Add category
                addCategory(_types, data[i]);


                // Create or add to category
                var catIndex = _.findIndex(returnObj.places, function(a) { return (a.hasOwnProperty('category') && a.category.type == data[i].category.type); });
                if( catIndex >= 0)
                    returnObj.places[catIndex].places.push(data[i]);
                else
                    returnObj.places.push({category: data[i].category, places: [data[i]]});
            }

            returnObj.oldCoords = angular.copy(DataSvc.adress.dest.coord);
            console.log(returnObj.places);
        };

        var returnObj = {

            places: [],
            numSearches: 0,
            oldCoords: {latitude: 0, longitude: 0},

            IsStale: function(){
                return returnObj.oldCoords.latitude == DataSvc.adress.dest.coord.latitude && returnObj.oldCoords.longitude == DataSvc.adress.dest.coord.longitude;
            },

            GetPlaces: function(){
                if(!returnObj.IsStale()){

                    $rootScope.$broadcast('cleanTabs');
                    returnObj.places.splice(0, returnObj.places.length);

                    var prefs = PersistenceSvc.GetPreferences();

                    var reqObj = {
                        latitude: DataSvc.adress.dest.coord.latitude,
                        longitude: DataSvc.adress.dest.coord.longitude,
                        rankBy: prefs.rankBy,
                        radius: prefs.radius,
                        types: PersistenceSvc.GetArrayPreferences()
                    };

                    console.log(reqObj)

                    if(reqObj.types.length == 0){
                        $ionicPopup.show({
                            title: 'Selecciona preferencias',
                            template: 'Para crear una guía, debes seleccionar tus intereses en preferencias.',
                            buttons: [
                                {
                                    text: 'Ir a preferencias',
                                    type: 'button-positive',
                                    onTap: function(e) { $state.go('app.preferences'); }
                                }
                            ]
                        });
                        return false;
                    }

                    $ionicLoading.show({
                        template: 'Cargando... <i class="icon ion-load-c ion-spin"></i>'
                    });

                    ngGPlacesAPI.nearbySearch(reqObj).then(function(data){
                        processResults(data);
                        $ionicLoading.hide();
                    }, function(){
                        console.log(arguments);
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'No hay resultados',
                            template: 'No se han encontrado resultados para ' + DataSvc.adress.dest.txt
                        });
                    });
                }
            }
        };

        return returnObj;
    }]);