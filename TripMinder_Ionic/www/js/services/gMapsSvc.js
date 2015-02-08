angular.module('tripminder.services')

.factory('GMapsSvc',
 function(){
     
     
     var gmaps = new function(){
         
         this.canDrag = { menu: true }
         this.canScroll = { view: true }
         
         
     }
     
     return gmaps;
 }
);