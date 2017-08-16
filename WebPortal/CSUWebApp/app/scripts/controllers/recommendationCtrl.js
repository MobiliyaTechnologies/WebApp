/**
 * @ngdoc Controller
 * @name controller:recommendationCtrl
 * @author Jayesh Lunkad
 * @description 
 * # recommendationCtrl
 * 
 */
angular.module('WebPortal')
    .controller('recommendationCtrl', function (Restservice, $scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config, $rootScope) {
        console.log("Recommendation Controller [Info]");
        $scope.userId = localStorage.getItem("userId");
        $scope.filter = '';
        $scope.demoMode = JSON.parse(localStorage.getItem("demoMode"));
        if ($scope.demoMode) {
            var data = localStorage.getItem('demoCount');
            $scope.filter = '?DateFilter=' + data;
            $scope.demoCount = 1;
        }
        function getRecommendation() {
            Restservice.get('api/getrecommendations' + $scope.filter, function (err, response) {
                if (!err) {
                    $scope.recommendations = response;
                   
                    console.log("[Info]  :: Get recommendation ", response);
                }
                else {
                    console.log("[Error]  :: Get recommendation ", err);
                }

            });
        }
        getRecommendation();
        function getInsight() {
            Restservice.get('api/GetInsightData' + $scope.filter, function (err, response) {
                if (!err) {
                    console.log("[Info] :: Get Insight Data ", response);
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
                }
                else {
                    console.log("[Error]  :: Get Insight Data ", err);

                }

            });
        }
        getInsight();


        $rootScope.$on('demoCount', function (event, data) {
            $scope.filter = '?DateFilter=' + data;
            getRecommendation();
            getInsight();
        });

    });