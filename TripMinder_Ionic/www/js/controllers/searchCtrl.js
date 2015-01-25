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
	    			console.log(data);
	    		});
	    	}, 500);
    };

    $scope.GetDests = function(){

    	if($scope.timerPromise) 
    		$timeout.cancel($scope.timerPromise);

    	if($scope.inputs.dest)
	    	$scope.timerPromise = $timeout(function() {
	    		Resources.GoAutocomplete.get( { input: $scope.inputs.dest, types: '(regions)' } ).$promise.then(function(data){
	    			console.log(data);
	    		});
	    	}, 500);
    };

}]);
