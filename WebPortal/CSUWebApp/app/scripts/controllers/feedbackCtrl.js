angular.module('WebPortal')
    .controller('feedbackCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config) {
        console.log("Feedback Controller [Info]");
        $scope.userId = localStorage.getItem("userId");
        $scope.loading = true;
        $scope.YearlyConsumption = {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Classroom Feedback '
            },
            subtitle: {
               
            },
            xAxis: {
                categories: ['Feddback'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Feedback ',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: []
        };
        $scope.YearlyConsumption.series = [];

        function getClassRoomList() {
            $http({
                url: config.restServer + "api/getclassrooms/" + $scope.userId,
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log(response);
                $scope.Classes = response;
                $scope.selectedClass = $scope.Classes[1].ClassId;
                $scope.getFeedbackCount();
               
            });
        }
        getClassRoomList();

        

        $scope.getFeedbackCount = function () {
            $scope.getSensorList();
            $scope.loading =true;
            var JSONobj = new Object();
            
            JSONobj.ClassId = $scope.selectedClass;
            $http({
                url: config.restServer + "api/getfeedbackcount/" + $scope.userId,
                dataType: 'json',
                method: 'POST',
                data: JSONobj,
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                $scope.loading = false;
                $scope.YearlyConsumption.series = [];
                for (var i = 0; i < response.length; i++) {
                    var data = [];
                    data.push(response[i].AnswerCount);
                    
                    $scope.YearlyConsumption.series.push({
                        data: data,
                        name: response[i].AnswerDesc,
                    });
                   // $scope.YearlyConsumptionChart.reflow();
                }
            });
        }

        $scope.getSensorList = function () {
            console.log("get Sensor List")
            $scope.loading = true;
            var JSONobj = new Object();

            JSONobj.Class_Id = $scope.selectedClass;
            $http({
                url: config.restServer + "api/getallsensorsforclass/" + $scope.userId,
                dataType: 'json',
                method: 'POST',
                data: JSONobj,
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                $scope.sensors = response;
                console.log("response",response);
            });
        }
        
    });