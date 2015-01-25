

angular.module('tripminder').factory('Resources', ['$resource', 'Apis',
 function($resource, Apis){

    var resources = new function(){ 
        this.GoAutocomplete = $resource(Apis.goAutocomplete.url, 
        						{ input: '@input', types: '@types' , key: Apis.goAutocomplete.key});
    };
    

    return resources;
}])


