angular.module('WebPortal')
.controller('alertsCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal,config) {
    console.log("Alerts Controller");
    
    $scope.getAlerts = function(){
        $scope.datatable={'loader': true};
        $scope.loading = true;
        $http({
            url: config.restServer + "api/getallalerts/"+localStorage.getItem("userId"),
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function (response) {

            console.log("get alert response [Info]::", response);
            $scope.datatable.loader = false;
            $scope.alerts = response;    

        })
        .error(function (error) {
                 alert("Error : " + JSON.stringify(error));
        });
    }
    $scope.getAlerts();
    $scope.openPopup = function (alert) {
          if (alert.Alert_Type != 'Device Alert') {
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
          else {
              $scope.openDeviceAlertPopup(alert);
          }
    };
    
    $scope.openDeviceAlertPopup = function (alert) {
        var modalInstance = $modal.open({
            templateUrl: 'deviceAlertModal.html',
            controller: 'deviceAlertModalModalCtrl',
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
    

      
    });
angular.module('WebPortal').controller('alertModalCtrl', function ($scope, $modalInstance, alerts, $http,config) {
    
    $http({
        url: config.restServer + "api/getalertdetails/" + localStorage.getItem("userId") + "/" + alerts.Sensor_Log_Id,
        dataType: 'json',
        headers: {
            "Content-Type": "application/json"
        }
    }).success(function (response) {

        console.log("Get alert Details response [Info]::", response);
        $scope.selectAlert = response;
        acknowledgeAlert(alerts);

    })
    .error(function (error) {
            $scope.loading = "display:none;"
            alert("Error : " + JSON.stringify(error));
    });
    function acknowledgeAlert(alerts) {

        if (!alerts.Is_Acknowledged) {
            var JSONobj = new Object();
            JSONobj.Alert_Id = alerts.Alert_Id;
            JSONobj.Acknowledged_By = localStorage.getItem("UserName");
            $http({
                url: config.restServer + "api/acknowledgealert/" + localStorage.getItem("userId") ,
                dataType: 'json',
                method:'POST',
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


angular.module('WebPortal').controller('deviceAlertModalModalCtrl', function ($scope, $modalInstance, alerts, $http, config) {

    function getUnmappedSensorList() {

        $http({
            url: config.restServer + "api/getallsensors/" + localStorage.getItem("userId"),
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function (response) {
            console.log("Get Sensor list response [Info]::", response);
            $scope.sensors = response;  

        })
        .error(function (error) {
                alert("Error : " + JSON.stringify(error));
        });

    }
    getUnmappedSensorList();



    function getClassRoomList() {
        $http({
            url: config.restServer + "api/getclassrooms/" + localStorage.getItem("userId"),
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function (response) {

            console.log("Get Classroom Details response [Info]::", response);
            $scope.classrooms = response;
            var tablePos = $("#class-table").offset();
            var top = tablePos.top+40;
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
    $scope.dropped = function (sensorId) {
             var sid = sensorId.target.title;
             var sensorPos = $("#sensor_" + sid).offset();
             for (var i = 0; i < $scope.classrooms.length; i++) {
                if (sensorPos.top > $scope.classrooms[i].top-5 && sensorPos.top < $scope.classrooms[i].top + 45) {
                    console.log("Class Room Mapped ::", $scope.classrooms[i]);
                    $("#sensor_layout_"+sid).css({ display: 'block', left: $scope.classrooms[i].Y-50, top: $scope.classrooms[i].X+50,position:'absolute' });
                    var found = mapping.filter(function (item) { return item.sen === sid; });
                    var index = mapping.findIndex(function (item, i) {
                        return item.Sensor_Id == sid;
                    });
                    if (index >= 0) {
                        mapping[index].Class_Id = $scope.classrooms[i].ClassId;
                    }
                    else {
                        mapping.push({ 'Sensor_Id': sid, 'Class_Id': $scope.classrooms[i].ClassId})
                    }
                }
            }
    }
    $scope.associateSensor = function () {
        console.log(mapping);
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
                console.log("Assign Sendor  response [Info]::", response);
                alert("Sensor mapped with class ");
                $modalInstance.close();
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