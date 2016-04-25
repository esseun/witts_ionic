var cjs = angular.module('TempChartCtrl', ['chart.js'])

cjs.controller('TempChartCtrl', function($scope, $timeout, $ionicLoading, NfcService) {
    // Despite what they promise, angular-chart is NOT reactive as
    // charts are not updated when $scope variables change. This is
    // a dirty hack to make sure the rendering happens after data is
    // made available
    $timeout(function() {
        $scope.xSeries = [];
        $scope.ySeries = [];
        $scope.tempChartData = NfcService.patientTempRecords;
        $scope.xSeries = $scope.tempChartData.timeEntered;
        // y-series data must be provided in the following format:
        // [ [a, b, c], [d, e, f] ]
        $scope.ySeries.push($scope.tempChartData.tempFahrenheit);
    }, 1000);
});
