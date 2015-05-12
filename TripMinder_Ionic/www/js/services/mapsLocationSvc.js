angular.module('tripminder.services')

.factory('MapsSvc', ['uiGmapGoogleMapApi','$rootScope',
 function(uiGmapGoogleMapApi, $rootScope){
     
     var _maps = new function(){
         
         // handlers
         this.gMapsAPI = null;
         this.geocoder = null;
         
         // data
         this.canDrag = { menu: true };
         this.canScroll = { view: true };
         
         // promises
         this.promises = {
             gMapsAPI: uiGmapGoogleMapApi
         };
         
         this.InitAPI = function(){ 
             _maps.promises.gMapsAPI.then(function(api){
                 _maps.gMapsAPI = api;
                 _maps.geocoder = new api.Geocoder();
             });
         };

         this.CreateCustomMarker = function(id, lat, lon, label){
             return {
                 id: id,
                 coords: {
                     latitude: lat,
                     longitude: lon
                 },
                 options: {
                     draggable: false,
                     labelContent: label,
                     labelClass: 'map-marker-label',
                     labelAnchor: (18 + 4*label.length) + ' 0'
                 }
             }
         };
         
         // Markers
         this.CreateMarkerOriginDest = function(pId, pLat, pLon, pGeocodif){
             
             var _labelContent = 'Origen';
             var _labelAnchor = '42 0';
             
             if(pId > 0){
                 _labelContent = 'Destino';
                 _labelAnchor = '46 0';
             }
             
             return {
                  id: pId,
                  coords: {
                    latitude: pLat,
                    longitude: pLon
                  },
                  options: { 
                      draggable: true,
                      labelContent: _labelContent,
                      labelClass: 'map-marker-label',
                      labelAnchor: _labelAnchor
                  },
                  events: {
                    mousedown: function (marker, ev, args){ 
                        _maps.canDrag.menu = false;
                    },
                    mouseup: function (marker, ev, args){ 
                        _maps.canDrag.menu = true;
                        _maps.geocoder.geocode(
                            {'latLng': new google.maps.LatLng(marker.position.lat(), marker.position.lng())}, function(res, status){  
                                if(res[1]){ 
                                    if(pId == 0)
                                        pGeocodif.origin = res[1].formatted_address;
                                    else
                                        pGeocodif.dest = res[1].formatted_address;
                                
                                    $rootScope.$apply();
                                }
                            }
                        );
                    }
                  }
             };
         };
         
         
         // Maps
         this.CreateMapOriginDest = function(pLat, pLon, pZoom, map){
            return { 
                opened: false,
                canScroll: true,
                center: { latitude: pLat, longitude: pLon }, 
                zoom: pZoom,
                control: {},
                options: {
                    mapTypeControlOptions: { mapTypeIds: ['ROADMAP'] },
                    streetViewControl: false,
                    disableDoubleClickZoom: true
                }
             };
         };
         
         this.CreateDefaultResultMap = function(){
            var map = this.CreateMapOriginDest(38.38, -0.51, 16);
            map.strokeDefault = {
                color: '#387ef5',
                weight: 4,
                opacity: 0.6
            };
            map.strokeSelected = {
                color: '#1aa595',
                weight: 6,
                opacity: 1
            };
            
             return map;
         };
         
         
     };
     
     _maps.InitAPI();
     
     return _maps;
 }
])

.factory('LocationSvc', ['$cordovaGeolocation', '$ionicPopup',
 function($cordovaGeolocation, $ionicPopup){
     
     var _location = new function(){ 
         
         this.GetCurrentPosition = function(options){ 
             options = options || { maximumAge: 5000, timeout: 12000, enableHighAccuracy: true };
             return $cordovaGeolocation.getCurrentPosition(options);
         }
         
         this.HandleError = function(err){
            if(err.code == err.TIMEOUT)
               $ionicPopup.alert({
                 title: '<i class="tm-icon-left ion-alert"></i> Error en la localización',
                 template: 'No he encontrado tu localización actual'
               });
            else if(err.code == err.POSITION_UNAVAILABLE)
               $ionicPopup.alert({
                 title: '<i class="tm-icon-left ion-alert"></i> Error en la localización',
                 template: 'No tengo medios para localizarte. Necesito WiFi, GPS o Red móvil'
               });
            else
               $ionicPopup.alert({
                 title: '<i class="tm-icon-left ion-information"></i> Localización desactivada',
                 template: 'Activa la localización desde los ajustes de tu dispositivo'
               });
         }
     };
     
     return _location;
 }
]);






