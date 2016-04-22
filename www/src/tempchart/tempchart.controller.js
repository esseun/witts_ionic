var cjs = angular.module('TempChartCtrl', ['chart.js'])

cjs.controller('TempChartCtrl', function($scope, NfcService) {
    // x-axis
    $scope.timeEntered = ["Mon", "Tues", "Wed"];
    // y -axis
    $scope.tempFahrenheit = [
        ["92", "93", "88"]
    ];
});
