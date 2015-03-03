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
         
         this.AddCarRoute = function(obj){
             datakeeper.searchResults.car = {
                 title: obj[0].summary,
                 distance: obj[0].legs[0].distance,
                 duration: obj[0].legs[0].duration,
                 start_adress: obj[0].legs[0].start_adress,
                 end_adress: obj[0].legs[0].end_adress,
                 start_location: obj[0].legs[0].start_location,
                 end_location: obj[0].legs[0].end_location,
                 steps: obj[0].legs[0].steps,
                 polyline: obj[0].overview_polyline.points
             }
         }
     }
     
     return datakeeper;
 }
);