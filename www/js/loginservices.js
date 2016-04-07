var ls = angular.module('loginServices', [])

ls.service('APIInterceptor', function($rootScope, $q) {
    var service = this;
    
    service.responseError = function(response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        return $q.reject(response);
    };
});


ls.service('LoginService', function(Backand) {
    var service = this;
    
    service.signin = function (email, password, appName) {
        return Backand.signin(email, password);
    };
    
    // anonymous login disabled
    // service.anonymousLogin= function()  }
    
    service.signout = function () {
        return Backand.signout();
    };
});
