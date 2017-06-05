 /**
    * @ngdoc Directive
    * @name header
    * @description
    * # CSUWebApp
    *
    *  Directive for header 
    */
angular.module('WebPortal')
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

    function HeaderController($scope, $location, $rootScope, weatherServiceFactory, Restservice ) {
        $rootScope.hideHeader = ($location.path() === '/login') ? true : false;
        $scope.weather = weatherServiceFactory;
        $scope.weather.search();

        $scope.organization = {};
        $scope.organization.logo = "./app/images/bullet_green.svg";

        
        Restservice.get('api/GetOrganization', function (err, response) {
            if (!err) {
                $scope.organization = response;
                localStorage.setItem('organizationID', response.OrganizationID);
                console.log("[Info] :: GetOrganization ", response);

            }
            else {
                console.log("[Error]:: GetOrganization", err);
            }
        });

    }
})