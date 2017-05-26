/**
 * @ngdoc Controller
 * @name controller:recommendationCtrl
 * @author Jayesh Lunkad
 * @description 
 * # recommendationCtrl
 * 
 */
angular.module('WebPortal')
    .controller('recommendationCtrl', function (Restservice,$scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config) {
        console.log("Recommendation Controller [Info]");
        $scope.userId = localStorage.getItem("userId");
        function getRecommendation() {
            Restservice.get('api/getrecommendations/', function (err, response) {
                if (!err) {
                    $scope.recommendations = response;
                    $scope.$apply();
                }
                else {
                    console.log(err);
                }
            });
        }
        getRecommendation();
        function getInsight() {
            Restservice.get('api/GetInsightData', function (err, response) {
                if (!err) {
                    $scope.insight = response;
                    $scope.insight.ConsumptionValue = Math.round($scope.insight.ConsumptionValue) / 1000;
                    $scope.insight.PredictedValue = Math.round($scope.insight.PredictedValue) / 1000;
                    $scope.insight.overused = response.ConsumptionValue - response.PredictedValue;
                    if ($scope.insight.overused > 0) {
                        $scope.usage = "OVERUSED";
                    }
                    else {
                        $scope.usage = "UNDERUSED";
                    }
                    $scope.$apply();
                }
                else {
                    console.log(err);
                }
            });
        }
        getInsight();

    });