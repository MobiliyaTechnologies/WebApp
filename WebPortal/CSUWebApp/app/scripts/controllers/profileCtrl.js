angular.module('WebPortal')
    .controller('profileCtrl', function ($scope, $http, $location, $state, Auth, config, $modal, $log) {
        console.log("[Info] :: Profile Controller Loaded");
        $scope.changePassword = function () {
            console.log("[Info] :: Request change password api");
            if ($scope.newpwd == $scope.confpwd) {
                var JSONobj = new Object();
                JSONobj.Email = localStorage.getItem("Email");
                JSONobj.Password = $scope.oldpwd;
                JSONobj.New_Password = $scope.newpwd;
                $http({
                    url: config.restServer + "api/changepassword",
                    dataType: 'json',
                    method: 'POST',
                    data: JSONobj,
                    headers: {
                        "Content-Type": "application/json"

                    }
                }).success(function (response) {
                    console.log("[Info] :: Change Password Response", response);
                })
                    .error(function (error) {
                        alert("Error : " + JSON.stringify(error));
                    });
            }
            else {
                alert("Password Doesn't Match");
            }
        };
        $scope.resetSensor = function () {
            console.log("[Info] :: Request reset sensor api");
            $http({
                url: config.restServer + "api/resetsensors",
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log("[Info] :: Get Reset Sensor", response);
            })
                .error(function (error) {
                    console.log("Error : " + JSON.stringify(error));
                });
        }


        $scope.resetFeedback = function () {
            console.log("[Info] :: Request reset feedback api");
            $http({
                url: config.restServer + "api/resetfeedback",
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log("[Info] :: Get Reset Feedback", response);
            })
                .error(function (error) {
                    console.log("Error : " + JSON.stringify(error));
                });
        }




    });

