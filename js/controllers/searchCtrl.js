angular.module('tripminder')

.controller('SearchCtrl', ['$scope', '$timeout', '$state', '$ionicPopup','$ionicScrollDelegate', 'ResourcesSvc','RestSvc','$ionicPlatform', 'MapsSvc', 'LocationSvc','PersistenceSvc','DataSvc',
  function($scope, $timeout, $state, $ionicPopup, $ionicScrollDelegate, ResourcesSvc, RestSvc, $ionicPlatform, MapsSvc, LocationSvc, PersistenceSvc, DataSvc) {

      var MarkerPos = function(id){
          var search = { found: false, pos: 0};
          for (var i in $scope.markers)
              if($scope.markers[i].id == id){
                  search.found = true;
                  search.pos = i;
              }
          return search;
      };

      var FindMarker = function(id){
          for(var i in $scope.markers)
              if($scope.markers[i].id == id)
                  return $scope.markers[i];
      };


    // ** View data
      $scope.$on('$ionicView.beforeEnter', function() {
          $scope.inputs = DataSvc.searchInputs;
      });




      $scope.gaOptions = {
          types: ['(regions)']
      };


      $scope.$on('g-places-autocomplete:select', function (event, param) {
          if(window.cordova && window.cordova.plugins.Keyboard)
              cordova.plugins.Keyboard.close();

          try{

              console.log('Select')
              var id = 1;
              if(event.targetScope.input[0].id == "origin")
                id = 0;

              var search = MarkerPos(id);
              if(search.found){
                  $scope.markers[search.pos].coords.latitude = param.geometry.location.lat();
                  $scope.markers[search.pos].coords.longitude = param.geometry.location.lng();
              }
              else
                  $scope.markers.push(MapsSvc.CreateMarkerOriginDest(
                      id, param.geometry.location.lat(), param.geometry.location.lng(), $scope.inputs));

              $scope.UpdateBounds();

          }catch(err){ console.log(err); }
      });



      
    // ***** INPUT FUNCTIONS *****

    $scope.ScrollTo = function(id){
        var elem = document.getElementById(id);
        $timeout(function(){
            $ionicScrollDelegate.scrollTo(0, elem.offsetTop + 130, true);
            elem.focus();
        }, 100);
    };

    
    
      
    //***** SEARCH FUNCTIONS ******
      
    $scope.Search = function(){

        if($scope.markers.length < 2)
           $ionicPopup.alert({
             title: 'No origen o destino',
             template: 'Debes insertar un origen y un destino de la lista, o seleccionar en el mapa.'
           });
        else {
            var orig = $scope.inputs.origin;
            if($scope.inputs.origin.formatted_address)
                orig = $scope.inputs.origin.formatted_address;

            var dest = $scope.inputs.dest;
            if($scope.inputs.dest.formatted_address)
                dest = $scope.inputs.dest.formatted_address;

            PersistenceSvc.AddRouteHistory(orig, dest, FindMarker(0).coords, FindMarker(1).coords);
            RestSvc.Search(orig, dest, FindMarker(0).coords, FindMarker(1).coords);
        }
    };

      
      
      
    //****** MAPS ****** 
      
    $scope.map = MapsSvc.CreateMapOriginDest(38.38, -0.51, 16);
      
      
    $scope.map.events =  { 
        dragstart: function (m, e, a){
            MapsSvc.canDrag.menu = false;
            $scope.map.canScroll = false;
        },
        dragend: function(m, e, a){
            MapsSvc.canDrag.menu = true;
            $scope.map.canScroll = true;
        },
        dblclick : function (map, ev, args){ // Add marker on DblClick

            if($scope.markers.length < 2){
                var lat = args[0].latLng.lat();
                var lon = args[0].latLng.lng();
                var id = 0;

                // If already exists the origin
                if($scope.markers.length == 1 && $scope.markers[0].id == 0)
                    id = 1;

                MapsSvc.geocoder.geocode({'latLng': new google.maps.LatLng(lat, lon)}, function(res, s){  
                    console.log(res)
                    if(res[1]){ 
                        $timeout(function(){
                            if(id == 0) {
                                console.log('ORIGIN: ' + res[1].formatted_address);
                                $scope.inputs.origin = res[1].formatted_address;
                            }
                            else {
                                console.log('DEST: ' + res[1].formatted_address);
                                $scope.inputs.dest = res[1].formatted_address;
                            }
                        }, 0);
                    }
                });

                $scope.markers.push(MapsSvc.CreateMarkerOriginDest(id, lat, lon, $scope.inputs));
            }
        }
    };
        
      
    $scope.markers = [ ];
      
    $scope.UpdateBounds = function(){ 
        
        MapsSvc.promises.gMapsAPI.then(function(){ 
            if($scope.markers.length > 0){
                var map = $scope.map.control.getGMap();
                var bounds = new google.maps.LatLngBounds();

                for (var i in $scope.markers){ 
                    var aux = new google.maps.LatLng(
                        $scope.markers[i].coords.latitude, 
                        $scope.markers[i].coords.longitude
                    );
                    bounds.extend(aux);
                }

                map.fitBounds(bounds);
            }
            if($scope.markers.length == 1 && map.getZoom() > 14)
                map.setZoom(14);
    
        });
    };
      
    $scope.RemoveMarker = function(id){
        for (var i in $scope.markers)
            if($scope.markers[i].id == id)
               $scope.markers.splice(i, 1); 
    };
      
    
    
      
      
      
      
    //******* LOCALIZATION *******
      
    $ionicPlatform.ready(function() { 
        
        var cordovaCPPromise = LocationSvc.GetCurrentPosition();
        
        MapsSvc.promises.gMapsAPI.then(function() {
            
            cordovaCPPromise.then(function (position) { 
              $timeout(function(){
                  $scope.map.center = { 
                      latitude: position.coords.latitude, 
                      longitude: position.coords.longitude 
                  };
                  
                  //********** Localización
                  /*MapsSvc.geocoder.geocode(
                    {'latLng': new google.maps.LatLng($scope.map.center.latitude, $scope.map.center.longitude)}, function(res, status){ 
                        if(res && res[1])
                            $ionicPopup.alert({
                             title: 'Localización',
                             template: '<b>Estas en:</b> ' + res[1].formatted_address
                           });
                    }
                );*/
              }, 0);
            }, function(err) { 
                LocationSvc.HandleError(err);
            });
        });
    });
      
    
      
    //******* WATCHES ******
      
    $scope.$watch('markers', function(newValue, oldValue){
        $scope.UpdateBounds();
    }, true);  
    
    $scope.$watch('inputs.origin', function(newValue, oldValue){
        if(!newValue)
            $scope.RemoveMarker(0);
    });
      
    $scope.$watch('inputs.dest', function(newValue, oldValue){
        if(!newValue)
            $scope.RemoveMarker(1);
    });
      
      
    //****** EVENT HANDLERS ****** 
      
    $scope.$on('search-complete', function(ev, args){ 
        $state.go('app.results');
    });

      
}]);








