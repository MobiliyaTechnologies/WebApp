/**
 * @ngdoc AclServiceProvider
 * @name header
 * @description
 * # CSUWebApp
 *
 *  Service to handle access control list 
 */
angular.module('WebPortal')
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
            campus_admin: ['dashboard', 'overview', 'alerts', 'feedback', 'recommendation'],
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