angular.module('tripminder')

.factory('LocalStorage', ['$window', function($window) {
  return {
    Set: function(key, value) {
      $window.localStorage[key] = value;
    },
    Get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    SetObject: function(key, value) {
      $window.localStorage[key] = angular.toJson(value);
    },
    GetObject: function(key) {
      return angular.fromJson($window.localStorage[key] || '{}');
    }
  };
}]);