
angular.module('tripminder.directives', [])

    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    })

.directive('tmResetField', ['$compile', '$timeout','$rootScope', function($compile, $timeout, $rootScope) {
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
      var template = $compile('<i ng-show="enabled" ng-mousedown="reset()" class="tm-rs-icon ion-close ng-hide"></i>')(scope);
      el.after(template);

      scope.reset = function() {
        ctrl.$setViewValue(null);
        ctrl.$render();
        scope.enabled = false;
        $timeout(function() {
            el[0].focus();
            $rootScope.$broadcast('input-cleared', {input: attrs.ngModel});
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