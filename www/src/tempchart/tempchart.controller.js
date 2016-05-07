var wittsTempChart = angular.module('TempChartCtrl', ['chart.js'])

wittsTempChart.controller('TempChartCtrl', function($scope, $timeout, $ionicPopup, NfcService) {
    // Chart.js options
    $scope.chartOptions = {
        tooltipEvents: [],
        tooltipCaretSize: 0,
        tooltipFillColor: "rgba(0,0,0,0)",
        tooltipFontColor: "#444",
        tooltipTemplate: function(label) {
            return label.value;
        },
        onAnimationComplete: function() {
            this.showTooltip(this.datasets[0].points, true);
        }
    }
    // Despite what they promise, angular-chart is NOT reactive as
    // charts are not updated when $scope variables change. This is
    // a dirty hack to make sure the rendering happens after data is
    // made available
    $timeout(function() {
        $scope.xSeries = [];
        $scope.ySeries = [];
        $scope.tempChartData = NfcService.patientTempRecords;
        if (!$scope.tempChartData.timeEntered.length) {
            $ionicPopup.alert({
                title: 'No previous temperature measurements found'
            }).then(function(res) {
                angular.copy({}, NfcService.tagData);
            });
        }
        $scope.xSeries = $scope.tempChartData.timeEntered;
        // y-series data must be provided in the following format:
        // [ [a, b, c], [d, e, f] ]
        $scope.ySeries.push($scope.tempChartData.tempFahrenheit);
    }, 1000);
});
