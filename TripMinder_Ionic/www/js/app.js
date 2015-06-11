

angular.module('tripminder',
    ['ionic',
        'uiGmapgoogle-maps',
        'ngResource',
        'tripminder.directives',
        'tripminder.services',
        'angular-loading-bar',
        'angular-abortable-requests',
        'ngCordova',
        'dbaq.google.directions',
        'ionic-datepicker',
        'google.places',
        'ngGPlaces'
    ]
)

    .run(['$ionicPlatform', function($ionicPlatform) {
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
    }])


/****************  RUTAS  *****************/

    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
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
                })

                .state('app.results', {
                    url: "/results",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/results.html",
                            controller: 'ResultsCtrl'
                        }
                    }
                })
                .state('app.resultsDetail', {
                    url: "/results/:id/:num",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/resultsDetail.html",
                            controller: 'ResultsDetailCtrl'
                        }
                    }
                })
                .state('app.planeDetail', {
                    url: "/plane-results/:id/:num",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/planeDetail.html",
                            controller: 'ResultsDetailCtrl'
                        }
                    }
                })
                .state('app.history', {
                    url: "/history",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/history.html",
                            controller: 'HistoryCtrl'
                        }
                    }
                })
                .state('app.preferences', {
                    url: "/preferences",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/preferences.html",
                            controller: 'PreferencesCtrl'
                        }
                    }
                })
                .state('app.guide', {
                    url: "/guide",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/guide.html",
                            controller: 'GuideCtrl'
                        }
                    }
                })
                .state('app.guideDetail', {
                    url: "/guide/:id",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/guideDetail.html",
                            controller: 'GuideDetailCtrl'
                        }
                    }
                })
                .state('app.guideView', {
                    url: "/guideView",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/guideView.html",
                            controller: 'GuideViewCtrl'
                        }
                    }
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/search');
        }])


    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
    }])

    .config(['uiGmapGoogleMapApiProvider','Apis', function(uiGmapGoogleMapApiProvider, Apis) {
        uiGmapGoogleMapApiProvider.configure({
            key: Apis.google.key,
            v: '3.17',
            libraries: 'drawing,visualization,geometry'
        });
    }])

    .config(['$ionicConfigProvider', function($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom'); //other values: top
    }])


    .run(['IATA' , function(IATA){
        IATA.LoadData();
    }])



    .filter('capitalize', function () {
        return function (input, format) {
            if (!input) {
                return input;
            }
            format = format || 'all';
            if (format === 'first') {
                // Capitalize the first letter of a sentence
                return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
            } else {
                var words = input.split(' ');
                var result = [];
                words.forEach(function(word) {
                    if (word.length === 2 && format === 'team') {
                        // Uppercase team abbreviations like FC, CD, SD
                        result.push(word.toUpperCase());
                    } else {
                        result.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
                    }
                });
                return result.join(' ');
            }
        };
    })

    .filter('index', function () {
        return function (array, index) {
            if(array && array.length){
                if (!index)
                    index = 'index';
                for (var i = 0; i < array.length; ++i) {
                    array[i][index] = i;
                }
            }

            return array;
        };
    })

    .filter('toFixed', function () {
        return function (item, amount) {
            if(item)
                return item.toFixed(amount);
        };
    })


/*****************  CONFIG  ********************/
//.config(function($httpProvider){
//    $httpProvider.interceptors.push(function($q, $timeout) {
//        return {
//            'response': function(response) {
//                var defer = $q.defer();
//
//                console.log(response);
//
//                if(response.config.url.indexOf('sdttpe://') >= 0)
//                    $timeout(function() { defer.resolve(response); }, 1);
//                else
//                    defer.resolve(response);
//
//                return defer.promise;
//            },
//            'request': function(config){
//                    console.log(JSON.stringify(config));
//                return config;
//            },
//            'responseError': function(a){
//                console.log(arguments);
//                return a;
//            }
//        };
//    });
//});








