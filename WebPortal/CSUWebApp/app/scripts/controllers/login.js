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
        $scope.toggleClass = "fa fa-times fa-pencil";
        $scope.loading ="display:none;"
        console.log("Login Controller");

        //update token if not available 
        if (Token.data.accesstoken == '')
            Token.update(function () { }
        );

        $scope.sendLogin = function () {       
            console.log("Login Api Call");
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

        $scope.toggle = function () {
            
           
            if ($scope.toggleClass == "fa fa-times fa-pencil") {
                $scope.toggleClass = "fa fa-times";
                document.getElementById("forgotpasswordText").style.display = "none";
               // $(".form:nth-child(2)").css("display", "none");

            }
            else {
                $scope.toggleClass = "fa fa-times fa-pencil";
                //$(".form:nth-child(3)").css("display", "none");
                document.getElementById("forgotpasswordText").style.display = "block";
            }
            // Switches the forms  
            $('.form').animate({
                height: "toggle",
                'padding-top': 'toggle',
                'padding-bottom': 'toggle',
                opacity: "toggle"
            }, "slow");
            $(".form:nth-child(4)").css("display", "none");
         
        };
        $scope.forgotpasswordlabel = 'Forgot your password?';
        $scope.forgotPassword = function () {
            if ($scope.forgotpasswordlabel == 'Forgot your password?') {
                $scope.forgotpasswordlabel = 'Login';
                document.getElementById("registericon").style.display = "none";
            }
            else {
                $scope.forgotpasswordlabel = 'Forgot your password?';
                document.getElementById("registericon").style.display = "block";
            }
            // Switches the forms  
            $('.form').animate({
                height: "toggle",
                'padding-top': 'toggle',
                'padding-bottom': 'toggle',
                opacity: "toggle1"
            }, "slow");
           
            $(".form:nth-child(3)").css("display", "none");
           
        }

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

