angular.module('tripminder.services')

.factory('DataSvc',
 function(){
     
     
     var datakeeper = new function(){
         
         this.searchResults = {
             car: null
         }
         
         this.ResetSearchVars = function(){
             for (var prop in datakeeper.searchResults)
                if (datakeeper.searchResults.hasOwnProperty(prop))
                    datakeeper.searchResults[prop] = null;
         };
     }
     
     return datakeeper;
 }
);