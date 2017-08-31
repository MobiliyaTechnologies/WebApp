/**
    * @ngdoc Factory
    * @name aadService
    * @description
    * # CSUWebApp
    *
    *  Service to handle signIn and sign Up of user uising B2C 
    */
angular.module('WebPortal')
    .factory('aadService', function ($http, config, applicationInsightsService, $exceptionHandler) {
        var responseType = 'token id_token';
        var redirectURI = './redirect.html';
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
        return {
            signIn: function (callback) {
                hello.init({
                    adB2CSignIn: config.b2cApplicationId,
                    adB2CSignInSignUp: config.b2cApplicationId,
                    adB2CEditProfile: config.b2cApplicationId
                }, {
                        redirect_uri: '/redirect.html',
                        scope: 'openid ' + config.b2cApplicationId,
                        response_type: 'token id_token'
                    });
                var b2cSession = hello(helloNetwork.adB2CSignIn).getAuthResponse();
                callback(b2cSession);
            },
            signUp: function (callback) {
                var applicationId = config.b2cApplicationId;
                hello.init({
                    adB2CSignIn: applicationId,
                    adB2CSignInSignUp: applicationId,
                    adB2CEditProfile: applicationId
                }, {
                        redirect_uri: '../redirect.html',
                        scope: 'openid ' + applicationId,
                        response_type: 'token id_token'
                    });
                this.policyLogin(helloNetwork.adB2CSignInSignUp, loginDisplayType.Page);
            },
            logout: function () {
                var applicationId = config.b2cApplicationId;
                hello.init({
                    adB2CSignIn: applicationId,
                    adB2CSignInSignUp: applicationId,
                    adB2CEditProfile: applicationId
                }, {
                        redirect_uri: '/redirect.html',
                        scope: 'openid ' + applicationId,
                        response_type: 'token id_token'
                    });
                this.policyLogout(helloNetwork.adB2CSignIn, config.signInPolicyName);
            },
            policyLogin: function (network, displayType) {

                if (!displayType) {
                    displayType = 'page';
                }
                var b2cSession = hello(network).getAuthResponse();
                //in case of silent renew, check if the session is still active otherwise ask the user to login again
                if (!this.online(b2cSession) && displayType === loginDisplayType.None) {
                    bootbox.alert('Session expired... please login again', function () {
                        this.policyLogin(network, loginDisplayType.Page);
                    });
                    return;
                }
                hello(network).login({ display: displayType }, this.log).then(function (auth) {

                }, function (e) {
                    if ('Iframe was blocked' in e.error.message) {
                        this.policyLogin(network, loginDisplayType.Page);
                        return;
                    }
                    bootbox.alert('Signin error: ' + e.error.message);
                    $exceptionHandler(e.error);
                });
            },
            policyLogout: function (network, policy) {
                hello.logout(network, { force: true }).then(function (auth) {
                    console.log("auth :", auth);
                }, function (e) {
                    console.log("Erorr :", e);
                    $exceptionHandler(e.error);
                });
            },
            online: function (session) {
                var currentTime = (new Date()).getTime() / 1000;
                return session && session.access_token && session.expires > currentTime;
            },
            log: function (s) {

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


        };
    })