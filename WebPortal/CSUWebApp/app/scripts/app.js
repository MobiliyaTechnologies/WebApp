'use strict';
/**
 * @ngdoc overview
 * @name angulartestApp
 * @description
 * # angulartestApp
 *
 * Main module of the application.
 */
angular
    .module('WebPortal', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'ui.bootstrap',
        'datatables',
        'ngDragDrop',
        'angularjs-dropdown-multiselect',
        'mm.acl'

    ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $urlRouterProvider.when('/dashboard', '/dashboard/overview');
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: './app/views/login.html',
                controller: 'loginCtrl'

            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: './app/views/dashboard.html',
                controller: 'dashboardCtrl',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        if (AclService.can('dashboard')) {
                            // Has proper permissions
                            return true;
                        } else {
                            // Does not have permission
                            console.log("Not Permitted")
                            return $q.reject('Unauthorized');
                        }
                    }]
                }

            })
            .state('overview', {
                url: '/overview',
                parent: 'dashboard',
                templateUrl: './app/views/overview.html',
                controller: 'overviewCtrl',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        if (AclService.can('overview')) {
                            // Has proper permissions
                            return true;
                        } else {
                            // Does not have permission
                            console.log("Not Permitted")
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            })
            .state('reports', {
                url: '/reports',
                parent: 'dashboard',
                templateUrl: './app/views/reports.html',
                controller: 'reportCtrl',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        if (AclService.can('reports')) {
                            // Has proper permissions
                            return true;
                        } else {
                            // Does not have permission
                            console.log("Not Permitted")
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            })
            .state('profile', {
                url: '/profile',
                parent: 'dashboard',
                templateUrl: './app/views/profile.html',
                controller: 'profileCtrl',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        if (AclService.can('profile')) {
                            // Has proper permissions
                            return true;
                        } else {
                            // Does not have permission
                            console.log("Not Permitted")
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            })
            .state('alerts', {
                url: '/alerts',
                parent: 'dashboard',
                templateUrl: './app/views/alerts.html',
                controller: 'alertsCtrl',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        if (AclService.can('alerts')) {
                            // Has proper permissions
                            return true;
                        } else {
                            // Does not have permission
                            console.log("Not Permitted")
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            })
            .state('feedback', {
                url: '/feedback',
                parent: 'dashboard',
                templateUrl: './app/views/feedback.html',
                controller: 'feedbackCtrl',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        if (AclService.can('feedback')) {
                            // Has proper permissions
                            return true;
                        } else {
                            // Does not have permission
                            console.log("Not Permitted")
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            })
            .state('recommendation', {
                url: '/recommendation',
                parent: 'dashboard',
                templateUrl: './app/views/recommendation.html',
                controller: 'recommendationCtrl',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        if (AclService.can('recommendtaion')) {
                            // Has proper permissions
                            return true;
                        } else {
                            // Does not have permission
                            console.log("Not Permitted")
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            })
            .state('piconf', {
                url: '/piconf',
                parent: 'dashboard',
                templateUrl: './app/views/piconf.html',
                controller: 'piconfCtrl',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                        if (AclService.can('configuration')) {
                            // Has proper permissions
                            return true;
                        } else {
                            // Does not have permission
                            console.log("Not Permitted")
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            })
            .state('campusconf', {
                url: '/campusconf',
                parent: 'dashboard',
                templateUrl: './app/views/campusconf.html',
                controller: 'campusconfCtrl',
                authenticate: true
            })
            .state('dataconf', {
                url: '/dataconf',
                parent: 'dashboard',
                templateUrl: './app/views/dataconf.html',
                controller: 'dataconfCtrl',
                authenticate: true
            })
            .state('userconf', {
                url: '/userconf',
                parent: 'dashboard',
                templateUrl: './app/views/userconf.html',
                controller: 'userconfCtrl',
                authenticate: true
            })
            .state('redirect', {
                url: '/redirect',
                templateUrl: './app/views/userconf.html',
                controller: 'redirectCtrl',
                authenticate: true
            })



    })

    .factory('config', function ($http, $rootScope, $timeout) {
        var restServer, b2cApplicationId, adB2CSignIn, adB2CSignInSignUp;
        return {
            restServer: restServer,
            update: function (data) {
                console.log("[Info] :: Config Loaded ", data);
                this.restServer = data.restServer;
                this.b2cApplicationId = data.b2cApplicationId;
                this.tenantName = data.tenantName;
                this.signInPolicyName = data.signInPolicyName;
                this.signInSignUpPolicyName = data.signInSignUpPolicyName;
                this.editProfilePolicyName = data.editProfilePolicyName;
                this.redirect_uri = data.redirect_uri;

                localStorage.setItem("restServer", this.restServer);
                localStorage.setItem("b2cApplicationId", this.b2cApplicationId);
                localStorage.setItem("tenantName", this.tenantName);
                localStorage.setItem("signInPolicyName", this.signInPolicyName);
                localStorage.setItem("signInSignUpPolicyName", this.signInSignUpPolicyName);
                localStorage.setItem("editProfilePolicyName", this.editProfilePolicyName);
                localStorage.setItem("redirect_uri", this.redirect_uri);

                $timeout(function () {
                    $rootScope.$broadcast('config-loaded');
                }, 1000);

            }


        };
    })
    .factory('AuthService', function ($rootScope, $window) {
        this.userIsLoggedIn;
        this.username;
        return {
            setUser: function (aUser) {
                this.user = aUser;
                localStorage.setItem("userIsLoggedIn", aUser);
            },
            isLoggedIn: function () {
                this.userIsLoggedIn = localStorage.getItem('ARuserIsLoggedIn');
                return (this.userIsLoggedIn === 'true') ? true : false;
            },
            setData: function (data) {
                console.log("DATAAAA", data);
                localStorage.setItem("userId", data.UserId);
                localStorage.setItem("UserName", data.FirstName);
                localStorage.setItem("LastName", data.LastName);
                localStorage.setItem("Email", data.Email);
                localStorage.setItem("Avatar", data.Avatar);
                localStorage.setItem("RoleId", data.RoleId);

            },
            getData: function () {
                var data = {};
                return
            },
            isAuthenticated: function () {
                return true;
            }
        };
    })
    .factory('Token', function ($http, $location) {
        var data = {
            accesstoken: ''
        };
        return {
            data: data,
            update: function (callback) {
                $http({
                    url: $location.protocol() + '://' + $location.host() + ':' + $location.port() + "/PowerBIService.asmx/GetAccessToken",
                    //url: "https://cloud.csupoc.com/csu_preview/PowerBIService.asmx/GetAccessToken",
                    method: 'GET'

                }).then(function (response) {
                    data.accesstoken = response.data.tokens.AccessToken;
                    callback();

                })
                    .catch(function (error) {
                        console.log("Token Error :: " + JSON.stringify(error));
                    });
            }


        };
    })
    .factory('Restservice', function ($http, AuthService, config, $state) {

        return {
            get: function (urlpath, callback) {
                var authResponse = hello('adB2CSignIn').getAuthResponse();
                if (authResponse != null) {
                    $http({
                        url: config.restServer + urlpath,
                        dataType: 'json',
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": authResponse.token_type + ' ' + authResponse.access_token,
                            "Access-Control-Allow-Origin":"*"
                        }
                    }).then(function (response) {
                        callback(null, response.data);

                    })
                        .catch(function (error) {
                            callback(error, null);
                        });
                }
                else {
                    console.log("Please login");
                    // $state.go('login');
                }
            },
            post: function (urlpath, data, callback) {
                var authResponse = hello('adB2CSignIn').getAuthResponse();
                if (authResponse != null) {
                    //hello('adB2CSignIn').api({
                    //    path: config.restServer + urlpath,
                    //    method: 'post',
                    //    data: data,                        
                    //    headers: {
                    //        Authorization: authResponse.token_type + ' ' + authResponse.access_token,                            
                    //        contentType: 'application/json'
                    //    }
                    //}).then(function (response) {
                    //    callback(null, response);
                    //}, function (e) {
                    //    callback(e, null);

                    //    });


                    $http({
                        url: config.restServer + urlpath,
                        dataType: 'json',
                        method: 'POST',
                        data: data,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": authResponse.token_type + ' ' + authResponse.access_token,
                        }
                    }).then(function (response) {
                        callback(null, response);

                    })
                        .catch(function (error) {
                            callback(error, null);
                        });
                }
                else {
                    console.log("Please login");
                }
            },
            put: function (urlpath, data, callback) {
                var authResponse = hello('adB2CSignIn').getAuthResponse();
                if (authResponse != null) {
                    //hello('adB2CSignIn').api({
                    //    path: config.restServer + urlpath,
                    //    method: 'put',
                    //    data:data,
                    //    headers: {
                    //        Authorization: authResponse.token_type + ' ' + authResponse.access_token,
                    //        contentType: 'application/json'
                    //    }
                    //}).then(function (response) {
                    //    callback(null, response);
                    //}, function (e) {
                    //    callback(e, null);

                    //});
                    $http({
                        url: config.restServer + urlpath,
                        dataType: 'json',
                        method: 'PUT',
                        data: data,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": authResponse.token_type + ' ' + authResponse.access_token,
                        }
                    }).then(function (response) {
                        callback(null, response);

                    })
                        .catch(function (error) {
                            callback(error, null);
                        });
                }
                else {
                    console.log("Please login");
                }
            }



        };

    })
    .factory('aadService', function ($http, config) {
        //applicaionID created in AD B2C portal
        var applicationId = '3bdf8223-746c-42a2-ba5e-0322bfd9ff76';
        var scope = 'openid ' + applicationId;
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
                    adB2CSignIn: applicationId,
                    adB2CSignInSignUp: applicationId,
                    adB2CEditProfile: applicationId
                }, {
                        redirect_uri: '/redirect.html',
                        scope: 'openid ' + applicationId,
                        response_type: 'token id_token'
                    });
                var b2cSession = hello(helloNetwork.adB2CSignIn).getAuthResponse();
                callback(b2cSession);
            },
            signUp: function (callback) {
                helloNetwork.adB2CSignIn = config.adB2CSignIn;
                helloNetwork.adB2CSignInSignUp = config.adB2CSignInSignUp;
                applicationId = config.applicationId;
                scope = 'openid ' + applicationId;
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
            policyLogin: function (network, displayType) {

                if (!displayType) {
                    displayType = 'page';
                }
                console.log(network);
                var b2cSession = hello(network).getAuthResponse();
                console.log(b2cSession);
                //in case of silent renew, check if the session is still active otherwise ask the user to login again
                if (!this.online(b2cSession) && displayType === loginDisplayType.None) {
                    bootbox.alert('Session expired... please login again', function () {
                        this.policyLogin(network, loginDisplayType.Page);
                    });
                    return;
                }
                hello(network).login({ display: displayType }, this.log).then(function (auth) {
                    console.log(Auth);

                }, function (e) {
                    if ('Iframe was blocked' in e.error.message) {
                        this.policyLogin(network, loginDisplayType.Page);
                        return;
                    }
                    bootbox.alert('Signin error: ' + e.error.message);
                });
            },
            policyLogout: function (network, policy) {
                console.log("Logoutttt");
                hello.logout(network, { force: true }).then(function (auth) {
                    console.log("auth :", auth);
                }, function (e) {
                    console.log("Erorr :", e);
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
    .factory('weatherServiceFactory', function ($http, $templateCache) {
        var $weather = {};

        $weather.showWeather = function (response) {
            console.log("Weather Info ::", response);
            if ('data' in response) {
                if (response.data.query.count > 0) {
                    var data = response.data.query.results.channel;
                    $weather.location = data.location;
                    $weather.forecast = data.item.forecast.slice(0, 1);//1 is no day 
                    $weather.unit = data.units.temperature;
                    $weather.temp = data.item.condition.temp;
                    $weather.hasState = 'has-success';
                } else {
                    $weather.hasState = 'has-warning';
                    $weather.message = 'No results found!';
                }
            } else {
                $weather.hasState = 'has-warning';
                $weather.message = 'Invalid request!';
            }
            $weather.showLoader = false;
        };

        $weather.showError = function (response) {
            $weather.hasState = 'has-warning';
            $weather.message = 'Occurred a error with Yahoo search. Try again later.';
            $weather.showLoader = false;
        };
        $weather.getYahooUrl = function () {
            return "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='%s') and u='f'&format=json".replace("%s", this.city);
        };
        $weather.search = function () {
            if ($weather.city == '' || $weather.city == undefined) {
                $weather.hasState = 'has-warning';
                $weather.message = 'Please provide a location';
                return;
            }
            $weather.showLoader = true;
            $http.get(this.getYahooUrl(), {
                cache: $templateCache
            }).then(this.showWeather, this.showError);
        };
        $weather.city = 'Fort Collins, CO';
        $weather.location = {};
        $weather.forecast = [];
        $weather.unit = '';
        $weather.hasState = '';
        $weather.message = '';
        $weather.showLoader = false;

        return $weather;
    })

    .filter('temp', function ($filter) {
        return function (input, unit) {
            if (!unit) {
                unit = 'C';
            }
            var numberFilter = $filter('number');
            return numberFilter(input, 1) + '\u00B0' + unit;
        };
    })
    .directive('weatherIcon', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                code: '@'
            },
            controller: function ($scope) {
                $scope.setWeatherIcon = function (condid) {
                    var icon = '';
                    switch (condid) {
                        case '0':
                        case '2':
                            icon = 'wi-tornado';
                            break;
                        case '1':
                        case '14':
                        case '40':
                            icon = 'wi-storm-showers';
                            break;
                        case '3':
                        case '4':
                        case '37':
                        case '38':
                        case '39':
                        case '47':
                            icon = 'wi-thunderstorm';
                            break;
                        case '5':
                        case '13':
                        case '15':
                        case '16':
                        case '41':
                        case '42':
                        case '43':
                        case '46':
                            icon = 'wi-snow';
                            break;
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            icon = 'wi-sprinkle';
                            break;
                        case '10':
                        case '17':
                        case '18':
                        case '35':
                            icon = 'wi-hail';
                            break;
                        case '11':
                        case '12':
                            icon = 'wi-showers';
                            break;
                        case '23':
                        case '19':
                            icon = 'wi-cloudy-gusts';
                            break;
                        case '20':
                        case '21':
                        case '22':
                            icon = 'wi-fog';
                            break;
                        case '24':
                            icon = 'wi-cloudy-windy';
                            break;
                        case '25':
                            icon = 'wi-thermometer';
                            break;
                        case '26':
                            icon = 'wi-cloudy';
                            break;
                        case '27':
                            icon = 'wi-night-cloudy';
                            break;
                        case '28':
                            icon = 'wi-day-cloudy';
                            break;
                        case '29':
                            icon = 'wi-night-cloudy';
                            break;
                        case '30':
                            icon = 'wi-day-cloudy';
                            break;
                        case '31':
                            icon = 'wi-night-clear';
                            break;
                        case '32':
                            icon = 'wi-day-sunny';
                            break;
                        case '33':
                            icon = 'wi-night-clear';
                            break;
                        case '34':
                            icon = 'wi-day-sunny-overcast';
                            break;
                        case '36':
                            icon = 'wi-day-sunny';
                            break;
                        case '44':
                            icon = 'wi-cloudy';
                            break;
                        case '45':
                            icon = 'wi-lightning';
                            break;
                        default:
                            icon = 'wi-cloud';
                            break;
                    }
                    return icon;
                };
                $scope.icon = function () {
                    return $scope.setWeatherIcon($scope.code);
                };
            },
            template: '<div><i class="wi {{ icon() }}"></i><div>'
        };
    })
    .directive('header', function headerDirective() {
        return {
            bindToController: true,
            controller: HeaderController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                controller: '='
            },
            templateUrl: 'app/views/Directive/header.html'
        };

        function HeaderController($scope, $location, $rootScope, weatherServiceFactory) {
            $rootScope.hideHeader = ($location.path() === '/login') ? true : false;
            $scope.weather = weatherServiceFactory;
            $scope.weather.search();
            console.log("$scope.weather", $scope.weather);
        }
    })
    .run(function ($http, $rootScope, config, $location, Token, $interval) {
        console.log();
        $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/PowerBIService.asmx/updateConfig', null).then(function (data) {
            $http.get('config.json')
                .then(function (data, status, headers) {
                    config.update(data.data);

                })
                .catch(function (data, status, headers) {
                    // log error
                    alert('error');
                });
        }).catch(function (data) {
            console.log(':(', data);
        });
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
            }, 4000);

        }


    })
    .config(['AclServiceProvider', function (AclServiceProvider) {
        var myConfig = {
            storage: 'localStorage',
            storageKey: 'AppAcl'
        };
        AclServiceProvider.config(myConfig);
    }])
    .run(['AclService', function (AclService) {        
        var aclData = {
            admin: ['dashboard', 'overview', 'reports', 'configuration', 'alerts', 'feedback', 'recommendation'],
            campus_admin: ['dashboard', 'overview', 'reports', 'alerts', 'feedback', 'recommendation'],
            student: ['dashboard', 'feedback']
        }
        AclService.setAbilities(aclData);
       


    }])
    .run(['$rootScope', '$location', function ($rootScope, $location) {
        // If the route change failed due to our "Unauthorized" error, redirect them
        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
            if (rejection === 'Unauthorized') {
                $location.path('/');
            }
        })
    }]);
   

    