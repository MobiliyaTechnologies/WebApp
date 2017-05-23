'use strict';

/**
 * @ngdoc function
 * @name angulartestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angulartestApp
 */
angular.module('WebPortal')
    .controller('loginCtrl', ['$scope', '$http', '$state', 'AuthService', 'Token', 'config', '$interval', 'Restservice', '$modal', 'aadService', '$rootScope', 'AclService', function ($scope, $http, $state, AuthService, Token, config, $interval, Restservice, $modal, aadService, $rootScope, AclService) {

        console.log("[Info] :: Login Controller loaded");    
        //Azure B2c Config
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
        /**
         * Function to sign in Azure B2C
         */    
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

        //Once configuration is loaded it will broadcast an event 'config-loaded' which wil load rest server url
        $rootScope.$on('config-loaded', function () {
            $scope.showLogin = true;
            if (config.restServer == "" || config.restServer == undefined) {
                $scope.showLogin = false;
                var modalInstance = $modal.open({
                    templateUrl: 'configuration.html',
                    controller: 'configurationCtrl',

                }).result.then(function (result) {
                    $scope.avatar = result.src;
                });

            }
            else {
                var script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', './app/scripts/aadb2c.js');
                document.head.appendChild(script);
                $scope.signIn('intial');
                $scope.showLogin = true;
            }
        });
        $scope.signUp = function () {
            aadService.signUp();
        }   

        /*API*/
        function getUserDetails() {
            $scope.loading = "display:block;";
            Restservice.get('api/GetCurrentUser', function (err, response) {
                if (!err) {
                    $scope.loading = "display:none;";
                    console.log("[Info] :: Get Current User Details ", response);
                    AuthService.setData(response);
                    if (response.RoleId == 1) {
                        AclService.attachRole('admin');
                        $state.go('overview');
                    }
                    else if (response.RoleId == 2) {
                        AclService.attachRole('student');
                        $state.go('feedback');
                    }
                    else {
                        AclService.attachRole('campus_admin');
                        $state.go('overview');
                    }
                }
                else {
                    console.log(err);
                }
            });
        }
        
    }]);
   

    
