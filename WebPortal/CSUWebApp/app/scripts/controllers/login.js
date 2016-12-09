'use strict';

/**
 * @ngdoc function
 * @name angulartestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angulartestApp
 */
angular.module('WebPortal')
    .controller('loginCtrl', function ($scope, $http, $location, $state, Auth, Token,config) {
      
        $scope.loading ="display:none;"
        console.log("Login Controller");
        if (Token.data.accesstoken == '')
            Token.update(function () { }
            );
        $scope.sendLogin = function () {
          
           
            console.log("Login Call");
            if (!validateForm()) {

                return;
            }
            $scope.loading = "display:block;"
            var JSONobj = new Object();
            JSONobj.Email = $("#username").val();
            JSONobj.Password = $("#password").val();

            $http({
                url: config.restServer + "/api/signin",
                dataType: 'json',
                method: 'POST',
                data: JSONobj,
                headers: {
                    "Content-Type": "application/json"

                }
            }).success(function (response) {

               
                console.log(response);
                if (response.Status_Code == 200) {

                    localStorage.setItem("userId", response.User_Id);
                    localStorage.setItem("UserName", response.First_Name);
                    localStorage.setItem("LastName", response.Last_Name);
                    localStorage.setItem("Email", response.Email);
                    Auth.setUser(true);
                    $scope.loading = "display:none;"
                    $state.go('overview');

                } else {
                    $scope.loading = "display:none;"
                    alert(response.Message);
                }
            })
                .error(function (error) {
                    $scope.loading = "display:none;"
                    alert("Error : " + JSON.stringify(error));
             });
        };
       

    });


/**
 * Function That validate User and password fiels 
 */
function validateForm() {
    var username = $("#username").val();
    var password = $("#password").val();
    if (username == null || username == "") {
        alert("User name can't be blank");
        return false;
    } else {
        if (ValidateEmail(username)) {
            if (password.length < 3) {
                alert("Password must be at least 3 characters long.");
                return false;
            }
        } else {
            return false;
        }
    }


    return true;
}
/**
 * Function That validate User Email
 */
function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}