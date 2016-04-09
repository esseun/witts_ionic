var nfc = angular.module('NfcCtrl', [])

nfc.controller('NfcCtrl', function($scope, NfcService) {
    $scope.tag = NfcService.tag;
    $scope.clear = function() {
        NfcService.clearTag();
    };
});

nfc.factory('NfcService', function($rootScope, $ionicPlatform) {

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
