var app = angular.module('witts_ionic', [
    'ionic',
    'backand',
    'NfcCtrl',
    'NfcFilters',
    'LoginCtrl',
    'LoginServices',
    'common.interceptors.http']);


// ---------- States ---------- //

app.config(function(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

    BackandProvider.setAppName('witts');
    BackandProvider.setSignUpToken('c42ca035-f147-4604-bfd7-b965a95164e5');
    // anonymous login disabled
    // BackandProvider.setAnonymousToken('22518bb1-713d-40a5-8844-e959b0ce4394');

    $httpProvider.interceptors.push('HttpInterceptor');
    
    $stateProvider
        .state('tab', {
            url: '/tabs',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        .state('login', {
            cache: false,
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl as login'
        })
        .state('tab.home', {
            url: '/home',
            views: {
                'home-tab': {
                    templateUrl: 'templates/home.html',
                    controller: 'NfcCtrl'
                }
            }
        })
        .state('tab.measure', {
            url: '/measure',
            views: {
                'home-tab': {
                    templateUrl: 'templates/measure.html',
                    controller: 'NfcCtrl'
                }
            }
        })
        .state('tab.viewrecords', {
            url: '/viewrecords',
            views: {
                'home-tab': {
                    templateUrl: 'templates/viewrecords.html',
                    controller: 'NfcCtrl'
                }
            }
        })
        .state('tab.about', {
            url: '/about',
            views: {
                'about-tab': {
                    templateUrl: 'templates/about.html'
                }
            }
        })
        .state('tab.help', {
            url: '/help',
            views: {
                'help-tab': {
                    templateUrl: 'templates/help.html'
                }
            }
        });
    
    
    $urlRouterProvider.otherwise('/login');
    $httpProvider.interceptors.push('APIInterceptor');
    
});


// ---------- Style ---------- //

app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
});


// ---------- Start Up ---------- //

app.run(function($rootScope, $state, LoginService, Backand) {
    
    function unauthorized() {
        console.log("User is unauthorized, directing to login");
        $state.go('login');
    }
    
    function signout() {
        LoginService.signout();
    }
    
    $rootScope.$on('unauthorized', function() {
        unauthorized();
    });
    
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        if (toState.name == 'login') {
            signout();
        }
        else if (toState.name != 'login' && Backand.getToken() === undefined) {
            unauthorized();
        }
    });
    
});

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            
            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
