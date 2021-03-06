angular.module('tripminder.services')

    .factory('GuideSvc', ['$rootScope', '$ionicPopup', '$state', '$ionicLoading', '$timeout', 'DataSvc', 'PersistenceSvc', 'ngGPlacesAPI',
        function ($rootScope, $ionicPopup, $state, $ionicLoading, $timeout, DataSvc, PersistenceSvc, ngGPlacesAPI) {

        var calculateDistance = function(lat1, lon1, lat2, lon2){
            // Spherical law of cosines
            var dLon = (lon2-lon1).toRad();
            return Math.acos( Math.sin(lat1.toRad()) * Math.sin(lat2.toRad()) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.cos(dLon) ) * 6371.0;
        };


        var addCategory = function(item){
            for (var i in item.types) {
                var cat = PersistenceSvc.IsInCategory(returnObj._types, item.types[i]);
                if(cat) {
                    item.category = cat;
                    delete item.types;
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
            
        var processResult = function(item){
            // Retrieve images
            if(item.photos && item.photos.length > 0) {
                item.photo = item.photos[0].getUrl({'maxWidth': 700, 'maxHeight': 500});
                delete item.photos;
            }
            // Calculate distance to the address center
            item.distance = calculateDistance(item.geometry.location.lat(), item.geometry.location.lng(),
                DataSvc.adress.dest.coord.latitude, DataSvc.adress.dest.coord.longitude);


            addStars(item);

            // Add category
            addCategory(item);
        };

        var processResults = function(data){


            for(var i in data){
                processResult(data[i]);

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
            selected: [],
            guide: { address: null, places: null },
            myGuides: [],
            numSearches: 0,
            oldCoords: {latitude: 0, longitude: 0},
            _types: PersistenceSvc.GetArrayPreferencesKeys(),

            ProcessDetail: function(item){
                processResult(item);

                item.address = item.formatted_address.split(',');

                item.marker = {
                    id: 0,
                    coords: {
                        latitude: item.geometry.location.lat(),
                        longitude: item.geometry.location.lng()
                    },
                    options: {
                        draggable: false
                    }
                };


                if(item.reviews)
                    for(var i in item.reviews){
                       addStars(item.reviews[i]);
                    }
            },

            IsStale: function(){
                return returnObj.oldCoords.latitude == DataSvc.adress.dest.coord.latitude && returnObj.oldCoords.longitude == DataSvc.adress.dest.coord.longitude;
            },

            GetPlaces: function(){
                if(!returnObj.IsStale()){

                    returnObj._types = PersistenceSvc.GetArrayPreferencesKeys();
                    $rootScope.$broadcast('cleanTabs');
                    returnObj.places.splice(0, returnObj.places.length);
                    returnObj.selected.splice(0, returnObj.selected.length);

                    var prefs = PersistenceSvc.GetPreferences();

                    var reqObj = {
                        latitude: DataSvc.adress.dest.coord.latitude,
                        longitude: DataSvc.adress.dest.coord.longitude,
                        rankBy: prefs.rankBy,
                        radius: prefs.radius,
                        types: PersistenceSvc.GetArrayPreferences()
                    };

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
                        templateUrl: 'templates/partials/loading.html'
                    });

                    ngGPlacesAPI.nearbySearch(reqObj).then(function(data){
                        processResults(data);
                        $timeout(function(){ $ionicLoading.hide(); }, 1500);
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