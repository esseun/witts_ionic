var wittsLogin = angular.module('LoginCtrl', [])

wittsLogin.controller('LoginCtrl', function ($state, $rootScope, LoginService, $ionicLoading, $ionicPopup, Backand) {

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
