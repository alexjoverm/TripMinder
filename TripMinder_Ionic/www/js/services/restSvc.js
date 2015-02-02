
angular.module('tripminder.services')

/*******
  -- ResourcesSvc -- : it performs the ajax API calls and keep a range of cancellers promises
                    in order to can cancel the requests externally
********/

.factory('ResourcesSvc', ['$resource', 'Apis','$q',
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



/*******
  -- RestSvc --: uses the ResourcesSvc factory to perform more complex calls. Notify through 
                    $rootScope.$broadcast about changes and provides an intermediate layer between
                    the controllers and ResourcesSvc.
********/

.factory('RestSvc', ['$ionicLoading', 'ResourcesSvc','$timeout','$rootScope', 'DataSvc',
 function($ionicLoading, ResourcesSvc, $timeout, $rootScope, DataSvc){

    // ** Private
     
    var promises = {
        directions: null
    };
     
    var calls = {
        done: 0,
        total: 1
    };
     
    var CloseLoading = function(delay){ 
        $timeout(function(){ 
            $ionicLoading.hide(); 
            $rootScope.$broadcast('loading-closed');
        }, delay);
    }; 
     
    var ResetVars = function(){
        for (var prop in promises)
            if (promises.hasOwnProperty(prop))
                promises[prop] = null;
        
        for (var prop in restcaller.data)
            if (restcaller.data.hasOwnProperty(prop))
                restcaller.data[prop] = null;
         
        calls.done = 0;
    };
     
    var CheckFinished = function(){ 
        calls.done++;
        if(calls.done == calls.total)
            Finish();
    };
     
    var Finish = function(){ 
        $rootScope.$broadcast('search-complete');
        CloseLoading(1000);
    }; 
     
     
    // ** Public
     
    var restcaller = new function(){ 
        
        this.data = {
            directions: null
        }
        
        /*** Auxiliar functions ***/
        
        this.IsFinished = function(){
            return calls.done == calls.total;
        };
        
        this.Cancel = function(){
            for (var prop in promises)
                if (promises.hasOwnProperty(prop))
                    $timeout.cancel(promises[prop]);
            
            ResourcesSvc.ResolveCancellers(['directions']);
            CloseLoading(0);
        };
        
        
        /*** Callers functions ***/
        
        this.Search = function(origin, dest){ 
            
            // Init and reset ResourcesSvc and RestSvc promises, also DataSvc data
            ResetVars();
            ResourcesSvc.ResetCancellers(['directions']);
            DataSvc.ResetSearchVars();
            
            // Perform API calls
            promises.directions = ResourcesSvc.GoDirections.getOne({origin: origin, destination: dest}).$promise;
            
            promises.directions.then(function(data){ 
                CheckFinished();
                $rootScope.$broadcast('search-finished', {directions: true});
                DataSvc.searchResults.car = data.routes;
                console.log();
            }, function(response){ 
                CheckFinished();
                $rootScope.$broadcast('search-finished', {directions: false});
            });
                
            
            // Show loading screen
            $ionicLoading.show({ 
                templateUrl: 'templates/partials/loadingSearch.html'
            });
        };
    };
    

    return restcaller;
}])