

angular.module('tripminder', 
  ['ionic',
   'ngResource',
   'angular-loading-bar'
  ]
)

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


/****************  RUTAS  *****************/

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'SearchCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/search');
})



/*****************  CONFIG  ********************/
/*.config(function($httpProvider){
    $httpProvider.interceptors.push(function($q, $timeout) {
        return {
            'response': function(response) {
                var defer = $q.defer();
                $timeout(function() {
                            defer.resolve(response);
                    }, 1000);
                return defer.promise;
            }
        };
    });
});*/








