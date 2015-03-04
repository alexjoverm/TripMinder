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
         
         this.AddCarRoutes = function(arr){
             datakeeper.searchResults.car = []
                 
             if(arr.length > 3)
                 arr.length = 3;
             
             for(var i in arr){
                 var obj = {
                     title: arr[i].summary,
                     distance: arr[i].legs[0].distance,
                     duration: arr[i].legs[0].duration,
                     start_adress: arr[i].legs[0].start_adress,
                     end_adress: arr[i].legs[0].end_adress,
                     start_location: arr[i].legs[0].start_location,
                     end_location: arr[i].legs[0].end_location,
                     steps: arr[i].legs[0].steps,
                     polyline: arr[i].overview_polyline.points
                 }
                 
                 datakeeper.searchResults.car.push(obj);
             }
                 
         }
     }
     
     return datakeeper;
 }
);