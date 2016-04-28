var hc = angular.module('HelpCtrl', [])

hc.controller('HelpCtrl', function($scope, $location, $anchorScroll) {
    $scope.scrollTo = function(id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        // prevent additional routing logic from triggering
        $location.hash(old);
    }
});
