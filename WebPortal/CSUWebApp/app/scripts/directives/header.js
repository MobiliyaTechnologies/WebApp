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

    function HeaderController($scope, $location, $rootScope, weatherServiceFactory) {
        $rootScope.hideHeader = ($location.path() === '/login') ? true : false;
        $scope.weather = weatherServiceFactory;
        $scope.weather.search();
    }
})