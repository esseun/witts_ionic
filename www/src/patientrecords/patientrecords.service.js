var td = angular.module('PatientRecordsService', []);

td.factory('PatientRecordsService', function($http, $filter, Backand) {

    var factory = {
        getPatientInfo: getPatientInfo,
        getPatientTempRecords: getPatientTempRecords,
        postPatientTempRecords: postPatientTempRecords
    };
    return factory;
    
    function getPatientInfo(patientId) {
        // [id, patientId, firstName, lastName, assignedTo, dob]
        return $http ({
            method: 'GET',
            url: Backand.getApiUrl() + '/1/query/data/getPatientInfo',
            params: {
                parameters: {
                    p_id: patientId
                }
            }
        });
    }

    function getPatientTempRecords(patientId) {
        // [id, patientId, timeEntered, tempFahrenheit]
        return $http ({
            method: 'GET',
            url: Backand.getApiUrl() + '/1/query/data/getPatientTempRecords',
            params: {
                parameters: {
                    p_id: patientId
                }
            }
        });
    }

    function postPatientTempRecords(patientId, tempF) {
        var currTime = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
        console.log("currTIme: ", currTime);
        return $http ({
            method: 'GET',
            url: Backand.getApiUrl() + '/1/query/data/postPatientTempRecords',
            params: {
                parameters: {
                    p_id: patientId,
                    currTime: currTime,
                    temp: tempF
                }
            }
        });
    }
});
