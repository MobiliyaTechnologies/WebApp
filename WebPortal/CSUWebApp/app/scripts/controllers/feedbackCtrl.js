angular.module('WebPortal')
    .controller('feedbackCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config) {
        console.log("[Info] :: Feedback Controller loaded");
        $scope.userId = localStorage.getItem("userId");
        $scope.loading = true;
        $scope.feedbackChart = {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Classroom Feedback '
            },
            subtitle: {

            },
            xAxis: {
                categories: ['Feedback'],
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
        $scope.feedbackChart.series = [];
        /**
        * Function to get all classrooms  
        */
        function getClassRoomList() {
            $http({
                url: config.restServer + "api/getclassrooms/" + $scope.userId,
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log("Get Classroom Details [Info]", response);
                $scope.Classes = response;
                $scope.selectedClass = $scope.Classes[1].ClassId;
                $scope.getFeedbackCount();

            });
        }
        getClassRoomList();
        /**
        * Function to get feedback data based on selected class 
        */
        $scope.getFeedbackCount = function () {
            $scope.getSensorList();
            $scope.loading = true;
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
                console.log(" [Info] ::Get Feedback Count", response);
                $scope.loading = false;
                $scope.feedbackChart.series = [];
                for (var i = 0; i < response.length; i++) {
                    var data = [];
                    data.push(response[i].AnswerCount);
                    $scope.feedbackChart.series.push({
                        data: data,
                        name: response[i].AnswerDesc,
                    });
                }
            });
        }
        /**
        * Function to get sensor list based on selected class 
        */
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
                console.log("[Info] ::Get Sensor List Details ", response);
            });
        }

    });