var nfc = angular.module('NfcCtrl', ['PatientRecordsService'])

nfc.controller('NfcCtrl', function($scope,  NfcService) {
    $scope.tagData = NfcService.tagData;
    $scope.clear = function() {
        NfcService.clearTag();
    };
});

nfc.factory('NfcService', function($rootScope, $ionicPlatform, $filter, PatientRecordsService) {

    var tagData = {
        tag: null,
        patientId: null,
        patientRecords: []
    };

    $ionicPlatform.ready(function() {
        nfc.addNdefListener(function(nfcEvent) {
            //console.log(JSON.stringify(nfcEvent.tag, null, 4));
            $rootScope.$apply(function() {
                tagData.tag = nfcEvent.tag;
                tagData.patientId = $filter('decodePayload')(tagData.tag.ndefMessage[0]);
                PatientRecordsService.getPatientRecords(tagData.patientId)
                    .then(
                        function(response) {
                            tagData.patientRecords = response
                        },
                        function(httpError) {
                            throw httpError.status + " : " +
                                httpError.data;
                        });
            });
            console.log("Tag: ", tagData.tag);
            console.log("PatientId: ", tagData.patientId);
        }, function() {
            console.log("Listening for NDEF Tags.");
        }, function(reason) {
            alert("Error adding NFC Listener " + reason);
        })
    });

    return {
        tagData: tagData,
        clearTag: function() {
            angular.copy({}, this.tagData);
        }
    };
});
