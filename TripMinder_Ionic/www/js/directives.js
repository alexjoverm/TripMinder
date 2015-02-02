
angular.module('tripminder.directives', [])

.directive('tmResetField', ['$compile', '$timeout', function($compile, $timeout) {
  return {
    require: 'ngModel',
    scope: {},
    link: function(scope, el, attrs, ctrl) { 
        
      scope.enabled = false;
        
      // limit to input element of specific types
      var inputTypes = /text|search|tel|url|email|password/i;
      if (el[0].nodeName !== "INPUT") {
        throw new Error("resetField is limited to input elements");
      }
      if (!inputTypes.test(attrs.type)) {
        throw new Error("Invalid input type for resetField: " + attrs.type);
      }

      // compiled reset icon template
      var template = $compile('<i ng-show="enabled" ng-mousedown="reset()" class="tm-rs-icon ion-close"></i>')(scope);
      el.after(template);

      scope.reset = function() {
        ctrl.$setViewValue(null);
        ctrl.$render();
        scope.enabled = false;
        $timeout(function() {
            el[0].focus();
        }, 0, false);
      };

      el.bind('input', function() { 
          
        $timeout(function() { 
            scope.enabled = !ctrl.$isEmpty(el.val());
        }, 0);
      })
      .bind('focus', function() {
        scope.enabled = !ctrl.$isEmpty(el.val());
        scope.$apply();
      })
      .bind('blur', function() {
        scope.enabled = false;
        scope.$apply();
      });
    }
  };
}]);