angular.module('tripminder')

.controller('SearchCtrl', ['$scope', '$timeout', 'Resources',
  function($scope, $timeout, Resources) {

    $scope.inputs = {
    	origin: '',
    	dest: ''
    };

    $scope.origins = null;
	$scope.dests = null;

	$scope.timerPromise = null;



    $scope.GetOrigins = function(){ 
    	
    	if($scope.timerPromise) 
    		$timeout.cancel($scope.timerPromise);

    	if($scope.inputs.origin)
	    	$scope.timerPromise = $timeout(function() {
	    		Resources.GoAutocomplete.get( { input: $scope.inputs.origin, types: '(regions)' } ).$promise.then(function(data){
	    			$scope.origins = data.predictions;
	    		});
	    	}, 500);
    };

    $scope.GetDests = function(){

    	if($scope.timerPromise) 
    		$timeout.cancel($scope.timerPromise);

    	if($scope.inputs.dest)
	    	$scope.timerPromise = $timeout(function() {
	    		Resources.GoAutocomplete.get( { input: $scope.inputs.dest, types: '(regions)' } ).$promise.then(function(data){
	    			$scope.dests = data.predictions;
	    		});
	    	}, 500);
    };

    $scope.SelectOrigin = function(i){ 
        $scope.inputs.origin = $scope.origins[i].description;
        $scope.origins = null;
    };

    $scope.SelectDest = function(i){
        $scope.inputs.dest = $scope.dests[i].description;
        $scope.dests = null;
    };

}]);
