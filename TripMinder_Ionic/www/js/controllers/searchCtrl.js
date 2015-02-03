angular.module('tripminder')

.controller('SearchCtrl', ['$scope', '$timeout', '$state', '$ionicPopup','$ionicScrollDelegate', 'ResourcesSvc','RestSvc',
  function($scope, $timeout, $state, $ionicPopup, $ionicScrollDelegate, ResourcesSvc, RestSvc) {

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


    $scope.ScrollTo = function(id){
        var elem = document.getElementById(id);
        $timeout(function(){ 
            $scope.blured = true; // prevent Clear() to erase data
            $ionicScrollDelegate.scrollTo(0, elem.offsetTop + 60, true);
            elem.focus();
        }, 1);
    };
      
      
    $scope.Clear = function(varScope){ 
        if(!$scope.blured){
            if(varScope == 'origins')
                $scope.origins = null;
            else
                $scope.dests = null;
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
      
      
      
    //****** Event handlers  
      
    $scope.$on('search-complete', function(ev, args){ 
        $state.go('app.results');
    });

}]);








