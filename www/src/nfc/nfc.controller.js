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
        measuredTemp: null,
        patientInfo: [],
        patientTempRecords: []
    };
    var payload = [];

    $ionicPlatform.ready(function() {
        nfc.addNdefListener(function(nfcEvent) {
            //console.log(JSON.stringify(nfcEvent.tag, null, 4));
            $rootScope.$apply(function() {
                tagData.tag = nfcEvent.tag;
                payload = $filter('decodePayload')(tagData.tag.ndefMessage[0]);
                tagData.patientId = payload[0];
                tagData.measuredTemp = payload[1];

                PatientRecordsService.getPatientInfo(tagData.patientId)
                    .then(
                        function(response) {
                            tagData.patientInfo = response.data
                        },
                        function(httpError) {
                            throw httpError.status + " : " +
                                httpError.data;
                        });

                PatientRecordsService.getPatientTempRecords(tagData.patientId)
                    .then(
                        function(response) {
                            tagData.patientTempRecords = response.data
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
