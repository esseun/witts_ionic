var wittsNfc = angular.module('NfcCtrl', ['PatientRecordsService'])

wittsNfc.controller('NfcCtrl', function($scope,  NfcService) {
    $scope.tagData = NfcService.tagData;
    $scope.patientTempRecords = NfcService.patientTempRecords;
    $scope.postTemp = function(patientId, tempF) {
        NfcService.postPatientTempRecords(patientId, tempF);
    };
    $scope.clear = function() {
        NfcService.clearTag();
    };
});

wittsNfc.factory('NfcService', function($rootScope, $ionicPlatform, $ionicLoading, $ionicPopup, $filter, PatientRecordsService) {
    var tagData = {
        tag: null,
        patientId: null,
        measuredTemp: null,
        patientInfo: []
    };
    var patientTempRecords = {
        timeEntered: [],
        tempFahrenheit: []
    };

    var payload = [];
    var timeEntered = [];
    var tempFahrenheit = [];

    $ionicPlatform.ready(function() {
        nfc.addNdefListener(function(nfcEvent) {
            // clear data from previous scan
            angular.copy({}, tagData);
            timeEntered = [];
            tempFahrenheit = [];
            $ionicLoading.show();
            // get data for new scan
            $rootScope.$apply(function() {
                tagData.tag = nfcEvent.tag;
                payload = $filter('decodePayload')(tagData.tag.ndefMessage[0]);
                tagData.patientId = payload[0];
                tagData.measuredTemp = payload[1];

                PatientRecordsService.getPatientInfo(tagData.patientId)
                    .then(
                        function(response) {
                            tagData.patientInfo = response.data
                            $ionicLoading.hide();
                        },
                        function(httpError) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Error connecting to server - please try again'
                            }).then(function(res) {
                                angular.copy({}, tagData);
                            });
                            throw httpError.status + " : " +
                                httpError.data;
                        });

                PatientRecordsService.getPatientTempRecords(tagData.patientId)
                    .then(
                        function(response) {
                            for (i = response.data.length; i > 0; i--) {
                                if (i == response.data.length - 5) {
                                    // by default display 5 most recent measurements
                                    break;
                                }
                                timeEntered.unshift($filter('date')(response.data[i-1].timeEntered, 'yyyy-MM-dd @h:mma'));
                                tempFahrenheit.unshift(response.data[i-1].tempFahrenheit);
                            }
                            patientTempRecords.timeEntered = timeEntered;
                            patientTempRecords.tempFahrenheit = tempFahrenheit;
                            $ionicLoading.hide();
                        },
                        function(httpError) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Error connecting to server - please try again'
                            }).then(function(res) {
                                angular.copy({}, tagData);
                            });
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
        patientTempRecords: patientTempRecords,
        postPatientTempRecords: function(patientId, tempF) {
            PatientRecordsService.postPatientTempRecords(patientId, tempF)
                .then(
                    function(rseponse) {
                        $ionicPopup.alert({
                            title: 'Temperature successfully recorded'
                        }).then(function(res) {
                            angular.copy({}, tagData);
                        });
                    },
                    function(httpError) {
                        $ionicPopup.alert({
                            title: 'Error connecting to server - please try again'
                        }).then(function(res) {
                            angular.copy({}, tagData);
                        });
                        
                        throw httpError.status + " : " +
                            httpError.data;
                    });
        },
        clearTag: function() {
            angular.copy({}, this.tagData);
        }
    };
});
