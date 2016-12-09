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


    ])
   

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/dashboard', '/dashboard/overview');
        $urlRouterProvider.otherwise('/login');

        $stateProvider

            .state('login', {
                url: '/login',
                // parent: 'base',
                templateUrl: '../app/views/login.html',
                controller: 'loginCtrl'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '../app/views/dashboard.html',
                controller: 'dashboardCtrl'

            })
            .state('overview', {
                url: '/overview',
                parent: 'dashboard',
                templateUrl: 'app/views/overview.html',
                controller: 'overviewCtrl'
            })
            .state('reports', {
                url: '/reports',
                parent: 'dashboard',
                templateUrl: 'app/views/reports.html'
            })
            .state('profile', {
                url: '/profile',
                parent: 'dashboard',
                templateUrl: 'app/views/profile.html',
                controller: 'profileCtrl'
            });

    })
    .constant('config', {
        restServer : "http://powergridrestservice.azurewebsites.net/",
        //serverURL:"http://52.91.107.160:2000/"
    })
    .factory('Auth', function ($rootScope, $window) {
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
            }
        };
    })
    .run(function ($rootScope, Auth, $state) {
        //$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        //    console.log(toState);
        //    console.log(toParams);
        //    console.log(Auth.isLoggedIn());

        //        if (toState.name != 'login' && !Auth.isLoggedIn()) {
        //            $state.transitionTo('login');
        //         }
        //        else {

        //        }




        //});

    })
    .factory('Token', function ($http) {
        var data = {
            accesstoken: ''
        };
        return {
            data,
            update: function (callback) {
                $http({
                    url: "http://localhost:65159/PowerBIService.asmx/GetAccessToken",
                    method: 'GET'
                }).success(function (response) {
                    data.accesstoken = response.tokens.AccessToken;
                    callback();
                    
                })
                 .error(function (error) {
                    alert("Error : " + JSON.stringify(error));
                 });
            }
        };
    });