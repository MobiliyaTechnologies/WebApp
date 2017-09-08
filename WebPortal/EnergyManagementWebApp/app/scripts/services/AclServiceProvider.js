/**
 * @ngdoc AclServiceProvider
 * @name header
 * @description
 * # Energy Management
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
            premise_admin: ['dashboard', 'overview', 'alerts', 'feedback', 'recommendation'],
            student: ['dashboard', 'feedback']
        }
        AclService.setAbilities(aclData);


    }])
    .run(['$rootScope', '$location','$state', function ($rootScope, $location,$state) {
        // If the route change failed due to our "Unauthorized" error, redirect them
        $rootScope.$on('$stateChangeError', function (event, current, previous, rejection) {
            return $state.go('login');
            //console.log(rejection);
            //$location.path('/login');
            //if (rejection === 'Unauthorized') {
               
            //}
        })
    }]);