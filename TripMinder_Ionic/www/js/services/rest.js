
angular.module('tripminder.services', [])

.factory('Resources', ['$resource', 'Apis','$q',
 function($resource, Apis, $q){

    var cancellers = {
        directions: $q.defer()
    }
     
    var resources = new function(){ 
        
        //**** Cancellers helpers methods
        
        this.ResetCancellers = function(arr){ 
            for (var i in arr)
                cancellers[arr[i]] = $q.defer();
        };
        
        this.ResolveCancellers = function(arr){ 
            for (var i in arr){
                cancellers[arr[i]].resolve();
                cancellers[arr[i]] = $q.defer();
            }
        };
        
        
        //**** API callers
        
        this.GoAutocomplete = $resource(Apis.goAutocomplete.url, 
            { input: '@input', types: '@types' , key: Apis.goAutocomplete.key});
        
        this.GoDirections = $resource(Apis.goDirections.url, 
            { origin: '@origin', destination: '@destination', sensor: 'false' /*, key: Apis.goAutocomplete.key*/},
            { getOne: { method: 'GET', timeout: cancellers.directions.promise } });
    };
    

    return resources;
}])


.factory('RestCaller', ['$ionicLoading', 'Resources','$timeout','$rootScope',
 function($ionicLoading, Resources, $timeout, $rootScope){

    // ** Private
     
    var promises = {
        directions: null
    };
     
    var calls = {
        done: 0,
        total: 1
    };
     
    var CheckFinished = function(){ 
        calls.done++;
        if(calls.done == calls.total)
            $timeout(function(){ $ionicLoading.hide(); }, 900);
    };
     
    var ResetVars = function(){
        for (var prop in promises)
            if (promises.hasOwnProperty(prop))
                promises[prop] = null;
         
        calls.done = 0;
    };
     
     
    // ** Public
     
    var restcaller = new function(){ 
        
        this.GetPromises = function(){
            return promises;
        };
        /******************* CAMBIAR *****************/
        this.ChangeScope = function(scope){
            promises.directions.then(function(d){ 
                scope.directions = 'done';
            }, function(response){ 
                scope.directions = 'fail';
            });
        };
        
        this.Cancel = function(){
            for (var prop in promises)
                if (promises.hasOwnProperty(prop))
                    $timeout.cancel(promises[prop]); // Cancel ajax calls
            
            Resources.ResolveCancellers(['directions']);
            $ionicLoading.hide();
        };
        
        
        
        this.Search = function(origin, dest){ 
            
            ResetVars();
            Resources.ResetCancellers(['directions']);
            
            promises.directions = Resources.GoDirections.getOne({origin: origin, destination: dest}).$promise;
            
            promises.directions.then(function(data){ 
                CheckFinished();
            }, function(response){ 
                CheckFinished();
            });
                
            
            $ionicLoading.show({ 
                templateUrl: 'templates/partials/loadingSearch.html'
            });
        };
    };
    

    return restcaller;
}])