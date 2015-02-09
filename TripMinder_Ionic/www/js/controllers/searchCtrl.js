angular.module('tripminder')

.controller('SearchCtrl', ['$scope', '$timeout', '$state', '$ionicPopup','$ionicScrollDelegate', 'ResourcesSvc','RestSvc','$ionicPlatform', 'MapsSvc', 'LocationSvc',
  function($scope, $timeout, $state, $ionicPopup, $ionicScrollDelegate, ResourcesSvc, RestSvc, $ionicPlatform, MapsSvc, LocationSvc) {

    // ** View data
    $scope.inputs = {
    	origin: '',
    	dest: ''
    };
      
    $scope.geocodif = {
    	origin: '',
    	dest: ''
    };

    $scope.origins = null;
	$scope.dests = null;
    
    $scope.blured = false;

    // Promise to control $timeout 
	$scope.timerPromise = null;

      
    // ***** INPUT FUNCTIONS *****
      
    $scope.ScrollTo = function(id){
        var elem = document.getElementById(id);
        $timeout(function(){ 
            $scope.blured = true; // prevent Clear() to erase data
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
	    	}, 500);
    };
      
      
      
      
    // ****** SELECT FUNCTIONS ******
      
    $scope.Clear = function(varScope){ 
        if(!$scope.blured){ 
            $timeout(function(){
                if(varScope == 'origins')
                    $scope.origins = null;
                else
                    $scope.dests = null;
            }, 100);
        }
        else
            $scope.blured = false;
    };
      
    $scope.SelectOrigin = function(i){ 
        $scope.inputs.origin = $scope.origins[i].description;
        $scope.origins = null;
        if(window.cordova && window.cordova.plugins.Keyboard)
            cordova.plugins.Keyboard.close();
    };

    $scope.SelectDest = function(i){ 
        $scope.inputs.dest = $scope.dests[i].description;
        $scope.dests = null;
        if(window.cordova && window.cordova.plugins.Keyboard)
            cordova.plugins.Keyboard.close();
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
      
    $scope.mapInstance = null;
    $scope.geocoderInstance = null;
      
    $scope.map = MapsSvc.CreateMapOriginDest(38.38, -0.51, 16);
      
    $scope.map.events =  {
        mousedown: function (map, ev, args){  
            MapsSvc.canDrag.menu = false;
            $scope.map.canScroll = false;
        },
        mouseup: function (map, ev, args){ 
            MapsSvc.canDrag.menu = true;
            $scope.map.canScroll = true;
        }
    };
        
      
    $scope.markers = [ MapsSvc.CreateMarkerOriginDest(0, 38.38325, -0.512122, $scope.geocodif),
                       MapsSvc.CreateMarkerOriginDest(1, 38.38345, -0.514122, $scope.geocodif)
                     ];
      
      
      
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








