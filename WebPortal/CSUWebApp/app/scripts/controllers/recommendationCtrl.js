angular.module('WebPortal')
    .controller('recommendationCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config) {
        console.log("Recommendation Controller [Info]");
        $scope.userId = localStorage.getItem("userId");
        function getRecommendation() {
            $http({
                url: config.restServer + "api/getrecommendations/" + localStorage.getItem("userId"),
                dataType: 'json',
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                console.log("Get Recommendation list [Info]::", response);
                $scope.recommendations = response;

            })
                .error(function (error) {
                    alert("Error : " + JSON.stringify(error));
                });
        }
        getRecommendation();
        function getInsight() {
            $http({
                url: config.restServer + "api/getinsightdata/" + localStorage.getItem("userId"),
                dataType: 'json',
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                console.log("Get Recommendation list [Info]::", response);
                $scope.insight = response;
                $scope.insight.ConsumptionValue = Math.round($scope.insight.ConsumptionValue) / 1000;
                $scope.insight.PredictedValue = Math.round($scope.insight.PredictedValue) / 1000;
                $scope.insight.overused = response.ConsumptionValue - response.PredictedValue;
               
            })
                .error(function (error) {
                    alert("Error : " + JSON.stringify(error));
                });
        }
        getInsight();

    });