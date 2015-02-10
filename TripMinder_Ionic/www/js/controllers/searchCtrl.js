angular.module('tripminder')

.controller('SearchCtrl', ['$scope', '$timeout', '$state', '$ionicPopup','$ionicScrollDelegate', 'ResourcesSvc','RestSvc','$ionicPlatform', 'MapsSvc', 'LocationSvc',
  function($scope, $timeout, $state, $ionicPopup, $ionicScrollDelegate, ResourcesSvc, RestSvc, $ionicPlatform, MapsSvc, LocationSvc) {

    // ** View data
    $scope.inputs = {
    	origin: '',
    	dest: ''
    };

    $scope.origins = null;
	$scope.dests = null;
    
    $scope.blured = false;

    // Promise to control $timeout 
	$scope.timerPromise = null;
    $scope.blurPromise = null;

      
    // ***** INPUT FUNCTIONS *****
      
    $scope.ScrollTo = function(id){
        var elem = document.getElementById(id);
        $timeout(function(){ 
            $ionicScrollDelegate.scrollTo(0, elem.offsetTop + 130, true);
            elem.focus();
        }, 100);
    };
      
      
    $scope.GetData = function(inputData){ 
    	if($scope.timerPromise) 
    		$timeout.cancel($scope.timerPromise);

    	if(inputData)
	    	$scope.timerPromise = $timeout(function() {
	    		ResourcesSvc.GoAutocomplete.get( { input: inputData, types: '(regions)' } ).promise.then(function(data){ 
                    console.log(inputData);
                    if(inputData == $scope.inputs.origin){
	    			    $scope.origins = data.predictions;
                        if(data.predictions && data.predictions != [])
                            $scope.ScrollTo('input-1');
                    }
                    else{
                        $scope.dests = data.predictions;
                        if(data.predictions && data.predictions != [])
                            $scope.ScrollTo('input-2');
                    }
	    		});
	    	}, 600);
    };
      
      
      
      
    // ****** SELECT FUNCTIONS ******
      
    $scope.Clear = function(varScope){ 
        
        $scope.blurPromise = $timeout(function(){ 
            if(varScope == 'origins')
                $scope.origins = null;
            else
                $scope.dests = null;

            $ionicScrollDelegate.scrollTo(0, 0, true);
        }, 300);
    };
      
    $scope.Focus = function(){ 
        if($scope.blurPromise)
            $timeout.cancel($scope.blurPromise);
    };
      
      
    $scope.SelectOrigin = function(i){ 
        $scope.inputs.origin = $scope.origins[i].description;
        $scope.origins = null;
    
        if(window.cordova && window.cordova.plugins.Keyboard)
            cordova.plugins.Keyboard.close();
        
        $scope.AfterSelect($scope.inputs.origin, 0);
    };

    $scope.SelectDest = function(i){ 
        $scope.inputs.dest = $scope.dests[i].description;
        console.log($scope.dests[i].description);
        console.log($scope.inputs.dest);
        $scope.dests = null;
        
        if(window.cordova && window.cordova.plugins.Keyboard)
            cordova.plugins.Keyboard.close();
        
        $scope.AfterSelect($scope.inputs.dest, 1);
    };
      
    $scope.AfterSelect = function(placeStr, id){ 
        
        $timeout(function(){ $ionicScrollDelegate.scrollTo(0, 0, true); }, 0);
        
        var search = { found: false, pos: 0};
        
        for (var i in $scope.markers)
            if($scope.markers[i].id == id){
                search.found = true;
                search.pos = i;
            }
        
        MapsSvc.geocoder.geocode({'address': placeStr}, function(res, st) {
            if(res[0]){
                if(search.found){ 
                    console.log(res);
                    $scope.markers[search.pos].coords.latitude = res[0].geometry.location.lat();
                    $scope.markers[search.pos].coords.longitude = res[0].geometry.location.lng();
                }
                else
                    $scope.markers.push(MapsSvc.CreateMarkerOriginDest(id, res[0].geometry.location.lat(), res[0].geometry.location.lng(), $scope.inputs));
                
                $scope.$apply();
            }
        });
    };
      
    
    
      
    //***** SEARCH FUNCTIONS ******
      
    $scope.Search = function(){ 
        
        if(!$scope.inputs.origin || !$scope.inputs.dest)
           $ionicPopup.alert({
             title: 'Datos vacios',
             template: 'Debes insertar un origen y un destino'
           });
        else
    	   RestSvc.Search($scope.inputs.origin, $scope.inputs.dest);
    };

      
      
      
    //****** MAPS ****** 
      
    $scope.map = MapsSvc.CreateMapOriginDest(38.38, -0.51, 16);
      
    $scope.map.events =  {
        mousedown: function (map, ev, args){  
            MapsSvc.canDrag.menu = false;
            $scope.map.canScroll = false;
        },
        mouseup: function (map, ev, args){ 
            MapsSvc.canDrag.menu = true;
            $scope.map.canScroll = true;
        },
        click: function(map, ev, args){
            
            if($scope.markers.length < 2){
                var lat = args[0].latLng.lat();
                var lon = args[0].latLng.lng();
                var id = 0;
                
                // If already exists the origin
                if($scope.markers.length == 1 && $scope.markers[0].id == 0)
                    id = 1;
                
                MapsSvc.geocoder.geocode({'latLng': new google.maps.LatLng(lat, lon)}, function(res, s){  
                    
                    if(res[1]){ 
                        $timeout(function(){
                            if(id == 0)
                                $scope.inputs.origin = res[1].formatted_address;
                            else
                                $scope.inputs.dest = res[1].formatted_address;
                        }, 0);
                    }
                });
                
                $scope.markers.push(MapsSvc.CreateMarkerOriginDest(id, lat, lon, $scope.inputs));
                $scope.$apply();
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
            if($scope.markers.length == 1 && map.getZoom()> 15)
                map.setZoom(15);
    
        });
    };
      
    
    $scope.$watch('markers', function(newValue, oldValue){
        $scope.UpdateBounds();
    }, true);
      
      
      
      
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
                  MapsSvc.geocoder.geocode(
                    {'latLng': new google.maps.LatLng($scope.map.center.latitude, $scope.map.center.longitude)}, function(res, status){ 
                        if(res[1])
                            $ionicPopup.alert({
                             title: 'Localización',
                             template: '<b>Estas en:</b> ' + res[1].formatted_address
                           });
                    }
                );
              }, 0);
            }, function(err) { 
                LocationSvc.HandleError(err);
            });
        });
    });
      
    
      
      
      
      
    //****** EVENT HANDLERS ****** 
      
    $scope.$on('search-complete', function(ev, args){ 
        $state.go('app.results');
    });
      
    $scope.$on('input-cleared', function(ev, args){ 
        if(args.input == 'inputs.origin')
            $scope.origins = null;
        else
            $scope.dests = null;
        
        $scope.$apply();
    });

      
    // Prevent View from scrolling when dragging on the map
    $scope.OnScroll = function(){ 
        $ionicScrollDelegate.getScrollView().__enableScrollY = $scope.map.canScroll;
    };
      
      
    // Custom drag 
    $scope.dragAcum = 100;
      
    $scope.dragSum = function(e){ 
        $scope.dragAcum += e.gesture.deltaY / 2;
        $scope.dragAcum = $scope.dragAcum < 100 ? 100 : $scope.dragAcum;
        $scope.dragAcum = $scope.dragAcum > 250 ? 250 : $scope.dragAcum;
        $scope.map.canScroll = false;
    };
      
    $scope.dragRelease = function(){
        if($scope.dragAcum < 175){
            $scope.map.opened = false;
            $scope.dragAcum = 100;
        }
        else{
            $scope.map.opened = true;
            $scope.dragAcum = 250;
        }
        $scope.map.canScroll = true;
    };
      
      
      
      
    
      
}]);








