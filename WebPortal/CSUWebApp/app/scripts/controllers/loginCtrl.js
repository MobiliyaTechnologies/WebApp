'use strict';

/**
 * @ngdoc function
 * @name angulartestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angulartestApp
 */
angular.module('WebPortal')
    .controller('loginCtrl', ['$scope', '$http', '$state', 'Auth', 'Token', 'config','$interval', function ($scope, $http,$state, Auth, Token, config, $interval ) {

        console.log("Login Controller loaded :: [Info]");
        $scope.toggleClass = "fa fa-times fa-pencil";
        $scope.loading_wheel ="display:none;"        
        $scope.color = {
            name: 'blue'
        };

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
        /**
         * Function to call Rest request  
         */
        function sendRestReq(type, url, reqdata, callback) {
            $http({
                url: config.restServer + url,
                dataType: 'json',
                method: 'POST',
                data: reqdata,
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                callback(null, response);
            })
                .error(function (error) {
                    callback(error, null);
                });

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
        function policyLogin(network, displayType) {

            if (!displayType) {
                displayType = 'page';
            }

            var b2cSession = hello(network).getAuthResponse();
            console.log(b2cSession);
            //in case of silent renew, check if the session is still active otherwise ask the user to login again
            if (!online(b2cSession) && displayType === loginDisplayType.None) {
                bootbox.alert('Session expired... please login again', function () {
                    policyLogin(network, loginDisplayType.Page);
                });
                return;
            }
            
            hello(network).login({ display: displayType }, log).then(function (auth) {
                console.log(Auth);
                
            }, function (e) {
                if ('Iframe was blocked' in e.error.message) {
                    policyLogin(network, loginDisplayType.Page);
                    return;
                }
                bootbox.alert('Signin error: ' + e.error.message);
            });
        }

        function policyLogout(network, policy) {
             console.log("Logoutttt");
            hello.logout(network, { force: true }).then(function (auth) {
                //bootbox.alert('policy: ' + policy + ' You are logging out from AD B2C');
                console.log("auth :", auth);
            }, function (e) {
                console.log("Erorrrrrrr :",e);
            });
        }
        
        $scope.signIn = function (state) {
            hello.init({
                adB2CSignIn: applicationId,
                adB2CSignInSignUp: applicationId,
                adB2CEditProfile: applicationId
            }, {
                    redirect_uri: '/redirect.html',
                    scope: 'openid ' + applicationId,
                    response_type: 'token id_token'
                });
            var b2cSession = hello(helloNetwork.adB2CSignIn).getAuthResponse();
            console.log("b2cSession :: [info] ",b2cSession);
            if (!online(b2cSession) && state=='click') {              
                    policyLogin(helloNetwork.adB2CSignIn, loginDisplayType.Page);
              
            }
            else if (online(b2cSession) && state == 'intial') {
                //call get role api 
                //
                $state.go('dashboard');
            }
                     

        }
        $scope.signIn('intial');
        $scope.signUp = function () {
            hello.init({
                adB2CSignIn: applicationId,
                adB2CSignInSignUp: applicationId,
                adB2CEditProfile: applicationId
            }, {
                    redirect_uri: '../redirect.html',
                    scope: 'openid ' + applicationId,
                    response_type: 'token id_token'
                });
                policyLogin(helloNetwork.adB2CSignInSignUp, loginDisplayType.Page);            
               
        }

       
        
    }]);



