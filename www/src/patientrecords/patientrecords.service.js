var td = angular.module('PatientRecordsService', []);

td.factory('PatientRecordsService', function($http, Backand) {

    var factory = {
        getPatientInfo: getPatientInfo,
        getPatientTempRecords: getPatientTempRecords
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
});
