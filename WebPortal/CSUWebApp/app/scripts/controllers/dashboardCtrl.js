var restServer = "http://powergridrestservice.azurewebsites.net/"
angular.module('WebPortal')
    .controller('dashboardCtrl', function ($scope, $http, $location, $state) {
        $scope.username = localStorage.getItem("UserName");
        $scope.lastname = localStorage.getItem("LastName");
        
        
        $scope.logout = function () {
            console.log("logout");
            var JSONobj = new Object();
            JSONobj.Email = localStorage.getItem("Email");
           
            $http({
                url: restServer + "api/signout",
                dataType: 'json',
                method: 'POST',
                data: JSONobj,
                headers: {
                    "Content-Type": "application/json"

                }
            }).success(function (response) {
                console.log(response);
                //alert("Response : " + JSON.stringify(response)); 
                $state.go('login');
               
            })
                .error(function (error) {
                    alert("Error : " + JSON.stringify(error));
                });
        };
     
  });