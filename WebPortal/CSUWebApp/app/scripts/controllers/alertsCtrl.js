/**
 * @ngdoc Controller
 * @name controller:alertsCtrl
 * @author Jayesh Lunkad
 * @description 
 * # alertsCtrl
 * 
 */
angular.module('WebPortal')
    .controller('alertsCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config, DTOptionsBuilder, Restservice, $rootScope) {
        console.log("[Info] :: Alerts Controller");
        $scope.alertsFilter = "";
        $scope.demoMode = JSON.parse(localStorage.getItem("demoMode"));
        if ($scope.demoMode) {
            $scope.alertsFilter = '?DateFilter=' + localStorage.getItem('demoCount');
        }
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption('order', [2, 'desc']);

        /**
        * Function to get all alerts generated  
        */
        $scope.getAllAlerts = function () {
           $scope.datatable = { 'loader': true };
           Restservice.get('api/GetAllAlerts' + $scope.alertsFilter, function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get all alerts response ", response);
                    $scope.datatable.loader = false;
                    $scope.alerts = response;
                }
                else {
                    console.log("[Error]:: Get all alerts response", err);
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
        $rootScope.$on('demoCount', function (event, data) {
            console.log("Data", data);
            
            $scope.alertsFilter = '?DateFilter=' + data;
            $scope.getAllAlerts();
        });

    });

/**
 * Controller for alert detail popup
 */
angular.module('WebPortal').controller('alertModalCtrl', function ($scope, $modalInstance, alerts, $http, config, Restservice) {
   
    Restservice.get('api/GetAlertDetails/' + alerts.Sensor_Log_Id, function (err, response) {
        if (!err) {
            console.log("[Info]:: Get alert Details response ", response);
            $scope.selectAlert = response;
            acknowledgeAlert(alerts);
        }
        else {
            $scope.loading = "display:none;";
            console.log("[Error]:: Get alert Details response", error);
        }
    }); 

    /**
     * Function to update acknowledge sattus of alert 
     */
    function acknowledgeAlert(alerts) {

        if (!alerts.Is_Acknowledged) {
            var JSONobj = new Object();
            JSONobj.Alert_Id = alerts.Alert_Id;
            JSONobj.Acknowledged_By = localStorage.getItem("UserName");

            Restservice.put('api/AcknowledgeAlert', JSONobj, function (err, response) {
                if (!err) {
                    console.log("[Info]:: Get alert acknolwedgement response ", response);
                }
                else {
                    $scope.loading = "display:none;";
                    console.log("[Error]:: Get alert acknolwedgement response ", err);
                }
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
angular.module('WebPortal').controller('deviceAlertModalCtrl', function ($scope, $modalInstance, alerts, $http, config, Restservice) {
    /**
     * Function to get unmapped sensor associated with user 
     */
    function getUnmappedSensorList() {
        Restservice.get('api/GetAllUnMapSensors' , function (err, response) {
            if (!err) {
                console.log("[Info]:: Get Unmapped Sensor list response ", response);
                $scope.sensors = response;
            }
            else {
                console.log("[Error]:: Get Unmapped Sensor list response ", err);
            }
        }); 
    }
    getUnmappedSensorList();
    
    /**
     * Function to get classroom list  
     */
    function getClassRoomList() {
        Restservice.get('api/GetAllRooms', function (err, response) {
            if (!err) {
                console.log("[Info]:: Get Classroom Details response ", response);
                $scope.rooms = response;
                var tablePos = $("#class-table").offset();
                var top = tablePos.top + 40;
                var left = tablePos.left;
                setTimeout(function () {
                    for (var i = 0; i < $scope.rooms.length; i++) {
                        var rowPos = $("#RoomTable-" + $scope.rooms[i].RoomId).offset();
                        console.log("Row Pos.....", rowPos);
                        $scope.rooms[i].top = rowPos.top;
                        $scope.rooms[i].left = rowPos.left;
                        //top = top + 40;
                    }
                }, 2000);

            }
            else {
                console.log("[Error]:: Get Classroom Details response ", err);
            }
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
        for (var i = 0; i < $scope.rooms.length; i++) {
            if (sensorPos.top > $scope.rooms[i].top - 5 && sensorPos.top < $scope.rooms[i].top + 45) {
                console.log("Class Room Mapped ::", $scope.rooms[i]);
                $("#sensor_layout_" + sid).css({ display: 'block', left: $scope.rooms[i].Y-5+'%', top: $scope.rooms[i].X+'%', position: 'absolute' });
                var found = mapping.filter(function (item) { return item.sen === sid; });
                var index = mapping.findIndex(function (item, i) {
                    return item.Sensor_Id == sid;
                });
                if (index >= 0) {
                    mapping[index].Room_Id = $scope.rooms[i].RoomId;
                }
                else {
                    mapping.push({ 'Sensor_Id': sid, 'Room_Id': $scope.rooms[i].RoomId })
                }
            }
        }
    }
    /**
     * Function to call update api of Mapping of sensor with classroom   
     */
    $scope.associateSensor = function () {

        for (var i = 0; i < mapping.length; i++) {  
            Restservice.put('api/MapSensor/' + mapping[i].Sensor_Id + '/' + mapping[i].Room_Id,null, function (err, response) {
                if (!err) {
                    console.log("[Info]:: Assign Sensor  response ", response);
                    $modalInstance.close();
                }
                else {
                    console.log("[Error]:: Assign Sensor  response ", err);
                }
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
                console.log("[Info]:: Get Anomaly Details response ", response);
                $scope.anomaly = response;
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withDisplayLength(7);
                var data = [];
            }
            else {
                console.log("[Error]:: Get Anomaly Details response ", err);
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