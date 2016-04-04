// angular module for app
var app = angular.module('witts_ionic', ['ionic', 'nfcFilters']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
        .state('tabs', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })
        .state('tabs.home', {
            url: "/home",
            views: {
                'home-tab': {
                    templateUrl: "templates/home.html",
                    controller: 'HomeTabCtrl'
                }
            }
        })
        .state('tabs.measure', {
            url: "/measure",
            views: {
                'home-tab': {
                    templateUrl: "templates/measure.html"
                }
            }
        })
        .state('tabs.about', {
            url: "/about",
            views: {
                'about-tab': {
                    templateUrl: "templates/about.html"
                }
            }
        })
        .state('tabs.help', {
            url: "/help",
            views: {
                'help-tab': {
                    templateUrl: "templates/help.html"
                }
            }
        });
    
    
    $urlRouterProvider.otherwise("/tab/home");
    
});

app.controller('HomeTabCtrl', function($scope) {
    console.log('HomeTabCtrl');
});

app.controller('NfcCtrl', function($scope, nfcService) {
    $scope.tag = nfcService.tag;
    console.log("nfcService.tag: ", nfcService.tag);
    $scope.clear = function() {
        nfcService.clearTag();
    };
});

app.factory('nfcService', function($rootScope, $ionicPlatform) {

    var tag = {};

    console.log("Inside app.factory...");

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

app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
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
