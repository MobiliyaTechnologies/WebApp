angular.module('WebPortal')
    .controller('alertsCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config, DTOptionsBuilder, Restservice ) {
        console.log("[Info] :: Alerts Controller");
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption('order', [2, 'desc']);

        /**
        * Function to get all alerts generated  
        */
        $scope.getAllAlerts = function () {
           $scope.datatable = { 'loader': true };
            Restservice.get('api/GetAllAlerts', function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get all alerts response ", response);
                    $scope.datatable.loader = false;
                    $scope.alerts = response;
                    $scope.$apply();
                }
                else {
                    console.log(err);
                }
            });        
        }
        $scope.getAllAlerts();

        /**
        * Function to open popup according to type of alert  
        */
        $scope.openPopup = function (alert) {
            if (alert.Alert_Type == 'Device Alert') {
                $scope.openDeviceAlertPopup(alert);
            }
            else if (alert.Alert_Type == 'Anomaly') {
                $scope.openAnomalyAlertPopup(alert);
            }
            else {
                var modalInstance = $modal.open({
                    templateUrl: 'alertModal.html',
                    controller: 'alertModalCtrl',

                    resolve: {
                        alerts: function () {
                            return alert;
                        }
                    }
                }).result.then(function (result) {
                    $scope.getAlerts();
                });
            }


        };

        /**
        * Function to open popup for device related alert 
        */
        $scope.openDeviceAlertPopup = function (alert) {
            var modalInstance = $modal.open({
                templateUrl: 'deviceAlertModal.html',
                controller: 'deviceAlertModalCtrl',
                windowClass: 'app-modal-window',

                resolve: {
                    alerts: function () {
                        return alert;
                    }
                }
            }).result.then(function (result) {
                $scope.getAlerts();
            });
        };
        /**
        * Function to open popup for anamoly related alert 
        */
        $scope.openAnomalyAlertPopup = function (alert) {
            var modalInstance = $modal.open({
                templateUrl: 'anomalyAlertModal.html',
                controller: 'anomalyAlertModalCtrl',
                windowClass: 'app-modal-anomaly',

                resolve: {
                    alerts: function () {
                        return alert;
                    }
                }
            }).result.then(function (result) {
                $scope.getAlerts();
            });
        };

    });

/**
 * Controller for alert detail popup
 */
angular.module('WebPortal').controller('alertModalCtrl', function ($scope, $modalInstance, alerts, $http, config) {
    console.log("Alerts", alerts);
    $http({
        url: config.restServer + "api/getalertdetails/" + localStorage.getItem("userId") + "/" + alerts.Sensor_Log_Id,
        dataType: 'json',
        headers: {
            "Content-Type": "application/json"
        }
    }).success(function (response) {
            console.log("[Info]:: Get alert Details response ", response);
            $scope.selectAlert = response;
            acknowledgeAlert(alerts);
        })
        .error(function (error) {
            $scope.loading = "display:none;"
            alert("Error : " + JSON.stringify(error));
        });
    /**
     * Function to update acknowledge sattus of alert 
     */
    function acknowledgeAlert(alerts) {

        if (!alerts.Is_Acknowledged) {
            var JSONobj = new Object();
            JSONobj.Alert_Id = alerts.Alert_Id;
            JSONobj.Acknowledged_By = localStorage.getItem("UserName");
            $http({
                url: config.restServer + "api/acknowledgealert/" + localStorage.getItem("userId"),
                dataType: 'json',
                method: 'POST',
                data: JSONobj,
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                console.log("Get alert acknolwedgement response [Info]::", response);

            })
                .error(function (error) {
                    $scope.loading = "display:none;"
                    alert("Error : " + JSON.stringify(error));
                });
        }
    }
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

/**
 * Controller for device alert popup
 */
angular.module('WebPortal').controller('deviceAlertModalCtrl', function ($scope, $modalInstance, alerts, $http, config) {
    console.log("Alerts", alerts);
    /**
     * Function to get unmapped sensor associated with user 
     */
    function getUnmappedSensorList() {
        $http({
            url: config.restServer + "api/getallsensors/" + localStorage.getItem("userId"),
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function (response) {
            console.log("[Info]:: Get Unmapped Sensor list response ", response);
            $scope.sensors = response;

        })
            .error(function (error) {
                alert("Error : " + JSON.stringify(error));
            });

    }
    getUnmappedSensorList();
    
    /**
     * Function to get classroom list  
     */
    function getClassRoomList() {
        $http({
            url: config.restServer + "api/getclassrooms/" + localStorage.getItem("userId"),
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function (response) {

            console.log("[Info]:: Get Classroom Details response ", response);
            $scope.classrooms = response;
            var tablePos = $("#class-table").offset();
            var top = tablePos.top + 40;
            var left = tablePos.left;
            for (var i = 0; i < $scope.classrooms.length; i++) {
                $scope.classrooms[i].top = top;
                $scope.classrooms[i].left = left;
                top = top + 40;
            }

        })
            .error(function (error) {
                alert("Error : " + JSON.stringify(error));
            });
    }
    getClassRoomList();
    var mapping = [];

    /**
     * Function to map unmapped sensor when its classroom when dropped on UI  
     */
    $scope.dropped = function (sensorId) {
        var sid = sensorId.target.title;
        console.log(sid);
        var sensorPos = $("#sensor_" + sid).offset();
        for (var i = 0; i < $scope.classrooms.length; i++) {
            if (sensorPos.top > $scope.classrooms[i].top - 5 && sensorPos.top < $scope.classrooms[i].top + 45) {
                console.log("Class Room Mapped ::", $scope.classrooms[i]);
                $("#sensor_layout_" + sid).css({ display: 'block', left: $scope.classrooms[i].Y, top: $scope.classrooms[i].X, position: 'absolute' });
                var found = mapping.filter(function (item) { return item.sen === sid; });
                var index = mapping.findIndex(function (item, i) {
                    return item.Sensor_Id == sid;
                });
                if (index >= 0) {
                    mapping[index].Class_Id = $scope.classrooms[i].ClassId;
                }
                else {
                    mapping.push({ 'Sensor_Id': sid, 'Class_Id': $scope.classrooms[i].ClassId })
                }
            }
        }
    }
    /**
     * Function to call update api of Mapping of sensor with classroom   
     */
    $scope.associateSensor = function () {

        for (var i = 0; i < mapping.length; i++) {

            $http({
                url: config.restServer + "api/mapsensortoclass/" + localStorage.getItem("userId"),
                dataType: 'json',
                method: 'POST',
                data: mapping[i],
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                console.log("[Info]:: Assign Sendor  response ", response);

                $modalInstance.close();
            })
                .error(function (error) {
                    $scope.loading = "display:none;"
                    //alert("Error : " + JSON.stringify(error));
                });
        }
    }
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

/**
 * Controller for anamoly alert popup
 */
angular.module('WebPortal').controller('anomalyAlertModalCtrl', function ($scope, DTOptionsBuilder, $modalInstance, alerts, $http, config, Restservice ) {
    console.log("Alerts", alerts);
    var time = new Date(alerts.Timestamp);
    var unixtime = time.getTime() / 1000;
    unixtime = unixtime.toFixed(0)
    /**
     * Function to get anamoly alet details  
     */
    function getAnomalyDetails() {
        Restservice.get('api/GetAnomalyDetailsByDay/' + unixtime, function (err, response) {
            if (!err) {
                console.log("Get Anomaly Details response [Info]::", response);
                $scope.anomaly = response;
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(7);
                var data = [];
                $scope.$apply();
            }
            else {
                console.log(err);
            }
        });   
  
    }
    getAnomalyDetails();

    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});