angular.module('WebPortal')
.controller('alertsCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal,config) {
    console.log("Alerts Controller");
    
    $scope.getAlerts = function(){

        $http({
            url: config.restServer + "api/getallalerts/"+localStorage.getItem("userId"),
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function (response) {

            console.log("get alert response [Info]::", response);
            $scope.alerts = response;    

        })
        .error(function (error) {
                $scope.loading = "display:none;"
                alert("Error : " + JSON.stringify(error));
        });
    }
    $scope.getAlerts();
    $scope.openPopup = function (alert) {
          console.log(alert);

          var modalInstance = $modal.open({
              templateUrl: 'alertModal.html',
              controller: 'alertModalCtrl',
            
            resolve: {
                alerts: function () {
                    return alert;
                }
            }
            }).result.then(function (result) {
                  //$scope.avatar = result.src;
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