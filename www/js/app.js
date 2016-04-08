var app = angular.module('witts_ionic', ['ionic', 'backand', 'nfcFilters', 'loginServices']);


// ---------- States ---------- //

app.config(function(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

    BackandProvider.setAppName('witts');
    BackandProvider.setSignUpToken('c42ca035-f147-4604-bfd7-b965a95164e5');
    // anonymous login disabled
    // BackandProvider.setAnonymousToken('22518bb1-713d-40a5-8844-e959b0ce4394');
    
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
                    controller: 'HomeTabCtrl'
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
        .state('tab.view', {
            url: '/view',
            views: {
                'home-tab': {
                    templateUrl: 'templates/view.html',
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


// ---------- Controllers ---------- //

app.controller('HomeTabCtrl', function($scope) {});

app.controller('NfcCtrl', function($scope, nfcService) {
    $scope.tag = nfcService.tag;
    $scope.clear = function() {
        nfcService.clearTag();
    };
});

app.controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService, $ionicLoading, $ionicPopup) {

    var login = this;
    
    function signin() {
        $ionicLoading.show();
        LoginService.signin(login.email, login.password)
            .then(function() {
                $ionicLoading.hide();
                onLogin();
            }, function(error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Invalid email/password'
                });
                
                alertPopup.then(function(res) {
                    console.log(error);
                });
            })
    }
    
    // function anonymousLogin(){
    //     LoginService.anonymousLogin();
    //     onLogin();
    // }
    
    function onLogin(){
        $rootScope.$broadcast('authorized');
        $state.go('tab.home');
    }
    
    function signout() {
        $ionicLoading.show();
        LoginService.signout()
            .then(function () {
                $ionicLoading.hide();
                $rootScope.$broadcast('logout');
                $state.go('login', {}, {reload: true});
            })    
    }
    
    login.signin = signin;
    login.signout = signout;
    // login.anonymousLogin = anonymousLogin;
});


// ---------- Factories ---------- //

app.factory('nfcService', function($rootScope, $ionicPlatform) {

    var tag = {};

    $ionicPlatform.ready(function() {
        nfc.addNdefListener(function(nfcEvent) {
            console.log(JSON.stringify(nfcEvent.tag, null, 4));
            $rootScope.$apply(function(){
                angular.copy(nfcEvent.tag, tag);
                // if necessary $state.go('some-route')
            });
        }, function() {
            console.log("Listening for NDEF Tags.");
        }, function(reason) {
            alert("Error adding NFC Listener " + reason);
        });
    });

    return {
        tag: tag,

        clearTag: function () {
            angular.copy({}, this.tag);
        }
    };
});


// ---------- Misc ---------- //

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
