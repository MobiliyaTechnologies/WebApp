angular.module('WebPortal')
    .controller('profileCtrl', function ($scope, $http, $location, $state, Auth,config) {
        console.log("logout");
        var JSONobj = new Object();
        
        $scope.changepwd = function () {
            console.log("Change pwd");
            if ($scope.newpwd == $scope.confpwd) {
                JSONobj.Email = localStorage.getItem("Email");
                JSONobj.Password = $scope.oldpwd;
                JSONobj.New_Password = $scope.newpwd;
                console.log($scope.newpwd);
                console.log($scope.confpwd);
                $http({
                    url: config.restServer + "api/changepassword",
                    dataType: 'json',
                    method: 'POST',
                    data: JSONobj,
                    headers: {
                      "Content-Type": "application/json"

                    }
                }).success(function (response) {
                    console.log(response);
                    //alert("Response : " + JSON.stringify(response)); 
                   // $state.go('login');

                })
                    .error(function (error) {
                        alert("Error : " + JSON.stringify(error));
                    });
            }
            else {
                alert("Password Doesnt Match");
            }
        };
        

    });