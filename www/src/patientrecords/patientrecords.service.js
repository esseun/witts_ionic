var td = angular.module('PatientRecordsService', []);

td.factory('PatientRecordsService', function($http, Backand) {

    var factory = {
        getPatientRecords: getPatientRecords
    };
    return factory;

    function getUrl() {
        return Backand.getApiUrl() + '/1/objects/tempData';
    }
    
    /*
    function getPatientRecords() {
        return $http.get(getUrl());
    }
    */

    function getPatientRecords(patientId) {
        console.log("Inside getPatientRecords http request");
        return $http ({
            method: 'GET',
            url: Backand.getApiUrl() + '/1/query/data/getPatientRecords',
            params: {
                parameters: {
                    p_id: patientId
                }
            }
        });
    }
});
