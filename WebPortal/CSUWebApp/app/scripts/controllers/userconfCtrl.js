angular.module('WebPortal')
    .controller('userconfCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config) {
        $scope.names = ["Emil", "Tobias", "Linus"];
        $scope.cars = [{ id: 1, label: 'Audi' }, { id: 2, label: 'BMW' }, { id: 3, label: 'Honda' }];
        $scope.selectedCar = [];
        $scope.example13data = [
            { id: 1, label: "David" },
            { id: 2, label: "Jhon" },
            { id: 3, label: "Lisa" },
            { id: 4, label: "Nicole" },
            { id: 5, label: "Danny" }];
        $scope.CategoriesSelected = [];
        $scope.Categories = [];
        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px'
        }

        $scope.options = [
            { id: 1, name: 'BMW' }, { id: 2, name: 'Audi' }, { id: 3, name: 'Honda' }
        ];
        $scope.selectedCars = [{ id: 2, name: 'Audi' }];

        $scope.fruits = [{ id: 1, name: 'apple' }, { id: 2, name: 'orange' }, { id: 3, name: 'banana' }]
        $scope.selectedFruits = null;
    });