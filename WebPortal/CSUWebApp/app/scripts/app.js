'use strict';
/**
 * @ngdoc overview
 * @name Energy Management Web App
 * @description
 * # CSUWebApp
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
                            console.log("[Info] ::Not Permitted");
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
                            console.log("[Info] ::Not Permitted");
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
                            console.log("[Info] ::Not Permitted");
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
                            console.log("[Info] ::Not Permitted");
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
                            console.log("[Info] ::Not Permitted");
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
                        if (AclService.can('recommendation')) {
                            // Has proper permissions
                            return true;
                        } else {
                            // Does not have permission
                            console.log("[Info] ::Not Permitted");
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
                            console.log("[Info] ::Not Permitted");
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            })            
            .state('redirect', {
                url: '/redirect',
                templateUrl: './app/views/userconf.html',
                controller: 'redirectCtrl',
                authenticate: true
            })



    }) 

    /**
    * @ngdoc 
    * @name 
    * @description
    * # CSUWebApp
    *
    *  Function that excutes whenever app get loaded 
    */
    .run(function ($http, $rootScope, config, $location, Token, $interval) {
        $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/PowerBIService.asmx/updateConfig', null).then(function (data) {
            $http.get('config.json')
                .then(function (data, status, headers) {
                    config.update(data.data);

                })
                .catch(function (data, status, headers) {
                    console.log("[Error]:: Updating config", data);
                });
        }).catch(function (data) {
            console.log("[Error]:: Updating config", data);
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
            }, 2400000);

        }


    })
   


