
angular.module('tripminder.services')


/*******
  -- ResourcesSvc -- : it performs the ajax API calls and keep a range of cancellers promises
                    in order to can cancel the requests externally
********/

.factory('ResourcesSvc', ['RequestFactory','Apis',
 function(RequestFactory, Apis){
     
    var resources = new function(){ 
        
        //**** API callers
        
        this.GoAutocomplete = RequestFactory.createResource({
            url: Apis.goAutocomplete.url,
            options: { input: '@input', types: '@types' , key: Apis.google.key },
            actions: { get: { method: 'GET' } }
        });
        
        this.GoDirections = RequestFactory.createResource({
            url: Apis.goDirections.url,
            options: { 
                origin: '@origin', 
                destination: '@destination', 
                sensor: 'false',
                mode: '@mode',
                alternatives: '@alternatives',
                avoid: '@avoid'
            },
            actions: { get: { method: 'GET'} }
        });
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
                    promises[prop].abort();
            
            CloseLoading(0);
        };
        
        
        /*** Callers functions ***/
        
        this.Search = function(origin, dest){ 
            
            // Init and reset ResourcesSvc and RestSvc promises, also DataSvc data
            ResetVars();
            DataSvc.ResetSearchVars();
            
          //******** Perform API calls
            
          // ** 1: Google Directions (CAR)
            var opt = {
                origin: origin, 
                destination: dest,
                alternatives: true
            }
            
            promises.directions = ResourcesSvc.GoDirections.get(opt);
            
            promises.directions.promise.then(function(data){ 
                console.log(data);
                CheckFinished();
                //Broadcast finished (true = success, false = failed)
                $rootScope.$broadcast('search-finished', { directions: true });
                DataSvc.AddCarRoutes(data.routes);
            }, function(response){ 
                if(response != 'ABORT'){
                    CheckFinished();
                    $rootScope.$broadcast('search-finished', {directions: false});
                }
            });
                
            
            // Show loading screen
            $ionicLoading.show({ 
                templateUrl: 'templates/partials/loadingSearch.html'
            });
        };
    };
    

    return restcaller;
}])