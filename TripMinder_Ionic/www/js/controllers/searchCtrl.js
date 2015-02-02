angular.module('tripminder')

.controller('SearchCtrl', ['$scope', '$timeout', '$state', '$ionicPopup', 'ResourcesSvc','RestSvc',
  function($scope, $timeout, $state, $ionicPopup, ResourcesSvc, RestSvc) {

    // ** View data
    $scope.inputs = {
    	origin: '',
    	dest: ''
    };

    $scope.origins = null;
	$scope.dests = null;

    // Promise to control $timeout 
	$scope.timerPromise = null;


    
    //***** API request functions
      
    $scope.GetData = function(inputData){ 
    	if($scope.timerPromise) 
    		$timeout.cancel($scope.timerPromise);

    	if(inputData)
	    	$scope.timerPromise = $timeout(function() {
	    		ResourcesSvc.GoAutocomplete.get( { input: inputData, types: '(regions)' } ).promise.then(function(data){ 
                    if(inputData == $scope.inputs.origin)
	    			    $scope.origins = data.predictions;
                    else
                        $scope.dests = data.predictions;
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








