'use strict';

/**
 * @ngdoc function
 * @name angulartestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angulartestApp
 */
angular.module('WebPortal')
    .controller('loginCtrl', ['$scope', '$http', '$state', 'AuthService', 'Token', 'config', '$interval', 'Restservice', '$modal', 'aadService', '$rootScope', function ($scope, $http, $state, AuthService, Token, config, $interval, Restservice, $modal, aadService, $rootScope) {

        console.log("Login Controller loaded :: [Info]");


        updateAccessToken();                   
        /**
        * Function to update Access Token 
        */        
        function updateAccessToken() {
            //update token if not available 
            if (Token.data.accesstoken == '')
                Token.update(function () { });
            $interval(function () {
                Token.update(function () { });
            }, 2000);

        }
              


        function log(s) {

            if (typeof s.error !== 'undefined' && s.error !== null) {
                if (s.error.code === 'blocked') {   //silentrenew(display: none) in case of expired token returns X-frame Options as DENY error
                    bootbox.alert("<p class='bg-danger'>there was an error in silent renewing the token. Please login again</p>");
                    return;
                }
            }
            else
                document.body.querySelector('.response')
                    .appendChild(document.createTextNode(JSON.stringify(s, true, 2)));
        }



        //applicaionID created in AD B2C portal
        var applicationId = '3bdf8223-746c-42a2-ba5e-0322bfd9ff76';
        var scope = 'openid ' + applicationId;
        var responseType = 'token id_token';
        var redirectURI = './redirect.html';

        //update the policy names with the exact name from the AD B2C policies blade
        var policies = {
            signInPolicy: "B2C_1_b2cSignin",
            editProfilePolicy: "B2C_1_b2cSiPe",
            signInSignUpPolicy: "B2C_1_b2cSiUpIn"
        };

        var loginDisplayType = {
            PopUp: 'popup',
            None: 'none',
            Page: 'page' 

        };

        var helloNetwork = {
            adB2CSignIn: 'adB2CSignIn',
            adB2CSignInSignUp: 'adB2CSignInSignUp',
            adB2CEditProfile: 'adB2CEditProfile'
        };

        //initiate all policies
       
        function online(session) {

            var currentTime = (new Date()).getTime() / 1000;
            return session && session.access_token && session.expires > currentTime;
        };
               
        $scope.signIn = function (state) {
            aadService.signIn(function (b2cSession) {
                if (!online(b2cSession) && state == 'click') {
                    aadService.policyLogin(helloNetwork.adB2CSignIn, loginDisplayType.Page);
                }
                else if (online(b2cSession) && state == 'intial') {
                    getUserDetails();
                }
            });                                         
        }
        $scope.showLogin = false;
        $rootScope.$on('config-loaded', function () {
            console.log("Here");
            $scope.showLogin = true;
            if (config.restServer == "" || config.restServer == undefined) {
                console.log("Show Configuration Popup");
                $scope.showLogin = false;
                var modalInstance = $modal.open({
                    templateUrl: 'configuration.html',
                    controller: 'configurationCtrl',

                }).result.then(function (result) {
                    $scope.avatar = result.src;
                });

            }
            else {
                $scope.signIn('intial');
                $scope.showLogin = true;
            }
        });
        ///$scope.signIn('intial');
        $scope.signUp = function () {           
            aadService.signUp();                 
        }


        /*API*/
        function getUserDetails() {
            $scope.loading = "display:block;";
            Restservice.get('api/GetCurrentUser', function (err, response) {
                if (!err) {
                    $scope.loading = "display:none;";
                    AuthService.setData(response.UserId, response.FirstName, response.LastName, response.Email, null);
                    $state.go('dashboard');
                }
                else {
                    console.log(err);
                }
            });
        }


       
        
    }]);
angular.module('WebPortal').controller('configurationCtrl', function ($scope, $modalInstance, $http) {
    $scope.var1 = "hii";
    $scope.configObj = {
        "restServer": "http://msqlserver12.cloudapp.net/CSU_RestService/",
         "dbConnection": "Db"
    }
    $scope.change = function () {  
        console.log($scope.configObj);       
        
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
});

    
