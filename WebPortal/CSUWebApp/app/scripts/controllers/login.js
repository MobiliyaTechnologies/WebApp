'use strict';
var restServer = "http://powergridrestservice.azurewebsites.net/"
/**
 * @ngdoc function
 * @name angulartestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angulartestApp
 */
angular.module('WebPortal')
    .controller('loginCtrl', function ($scope, $http, $location, $state, Auth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.showToast = function () {
        $mdToast.show(
            $mdToast.simple()
                .textContent('User registration completed!')
                .hideDelay(3000)
        );
    };
    if (localStorage.getItem("USERREGISTER") == 1) {
        localStorage.setItem("USERREGISTER", 0);
        $scope.showToast();
    }

    $scope.sendLogin = function () {
        console.log("sendLogin");
        if (!validateForm()) {

            return;
        }
        //alert("valid input !"); 
        var JSONobj = new Object();
        JSONobj.Email = $("#username").val();
        JSONobj.Password = $("#password").val();

        //alert("JSON : " + JSON.stringify(JSONobj));

        $http({
            url: restServer + "api/signin",
            dataType: 'json',
            method: 'POST',
            data: JSONobj,
            headers: {
                "Content-Type": "application/json"

            }
        }).success(function (response) {

            //alert("Response : " + JSON.stringify(response)); 
            console.log(response);
            if (response.Status_Code == 200) {
                //alert("Successfully logged in !");
                localStorage.setItem("userId", response.User_Id);
                localStorage.setItem("UserName", response.First_Name);
                localStorage.setItem("LastName", response.Last_Name);
                localStorage.setItem("Email", response.Email);
                Auth.setUser(true);
                //$location.path("/map");
                $state.go('overview');
                 // window.location.replace("BingMap.html");
            } else {
                alert(response.Message);
            }
        })
            .error(function (error) {
                alert("Error : " + JSON.stringify(error));
            });
      };

});
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

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}