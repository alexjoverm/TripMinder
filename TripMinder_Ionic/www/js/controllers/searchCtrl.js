angular.module('tripminder')

.controller('SearchCtrl', ['$scope', '$timeout', '$state', '$ionicPopup','$ionicScrollDelegate', 'ResourcesSvc','RestSvc', 'uiGmapGoogleMapApi', '$cordovaGeolocation','$ionicPlatform', 
  function($scope, $timeout, $state, $ionicPopup, $ionicScrollDelegate, ResourcesSvc, RestSvc, uiGmapGoogleMapApi, $cordovaGeolocation, $ionicPlatform) {

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

    $scope.ScrollTo = function(id){
        var elem = document.getElementById(id);
        $timeout(function(){ 
            $scope.blured = true; // prevent Clear() to erase data
            $ionicScrollDelegate.scrollTo(0, elem.offsetTop + 60, true);
            elem.focus();
        }, 100);
    };
      
      
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
    
    //***** API request functions
      
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
      
    $scope.Search = function(){ 
        
        if(!$scope.inputs.origin || !$scope.inputs.dest)
           $ionicPopup.alert({
             title: 'Datos vacios',
             template: 'Debes insertar un origen y un destino'
           });
        else
    	   RestSvc.Search($scope.inputs.origin, $scope.inputs.dest);
    };

      
      
    //***** Select functions
      
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
      
      
      
    //****** MAPS functions
    $scope.map = { 
        opened: false,
        center: { latitude: 45, longitude: -73 }, 
        zoom: 16,
        options: {
            mapTypeControlOptions: { mapTypeIds: ['ROADMAP'] }
        }
    };
      
    $scope.mapInstance = null;
    $scope.currentPoint = {
        radius: 10,
        geodesic: true,
        stroke: {
            color: '#08B21F',
            weight: 20,
            opacity: 0.4
        },
        fill: {
            color: '#08B21F',
            opacity: 1
        }
    };
      
    $scope.markers = [
        {
          id: 0,
          coords: {
            latitude: 38.38325,
            longitude: -0.512122
          },
          options: { 
              draggable: true,
              labelContent: 'Origen',
              labelClass: 'map-marker-label',
              labelAnchor: '42 0'
          },
          events: {
            dragend: function (marker, eventName, args) {
              
            }
          }
        },
        
        {
          id: 1,
          coords: {
            latitude: 38.38345,
            longitude: -0.514122
          },
          options: { 
              draggable: true,
              labelContent: 'Destino',
              labelClass: 'map-marker-label',
              labelAnchor: '46 0'
          },
          events: {
            dragend: function (marker, eventName, args) {
              
            }
          }
        }
    
    ];
      
      
    $ionicPlatform.ready(function() { 
        
        var cordovaCPPromise = $cordovaGeolocation.getCurrentPosition();
        
        uiGmapGoogleMapApi.then(function(maps) { 
            console.log('maps');
            $scope.mapInstance = maps;
            cordovaCPPromise.then(function (position) { 
              $timeout(function(){
                  $scope.map.center = { 
                      latitude: position.coords.latitude, 
                      longitude: position.coords.longitude 
                  };
                  $scope.currentPoint.center = angular.copy($scope.map.center); 
              }, 0);
            }, function(err) {
               $ionicPopup.alert({
                 title: 'Geolocation',
                 template: 'Error en el plugin geolocation'
               });
            });
        });
    });
      
    
       
    
      
    
      
      
      
      
    //****** Event handlers  
      
    $scope.$on('search-complete', function(ev, args){ 
        $state.go('app.results');
    });

      
    $scope.dragAcum = 100;
      
    $scope.dragSum = function(e){ 
        $scope.dragAcum += e.gesture.deltaY / 2;
        $scope.dragAcum = $scope.dragAcum < 100 ? 100 : $scope.dragAcum;
        $scope.dragAcum = $scope.dragAcum > 250 ? 250 : $scope.dragAcum;
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
    };
      
}]);








