angular.module('WebPortal')
    .controller('campusconfCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config, Restservice ) {

        /**
         * Function to get all campus associated with login user 
         */
        function getCampusList() {
            Restservice.get('api/GetAllCampus', function (err, response) {
                if (!err) {
                    $scope.campusList = response;
                    $scope.$apply();
                }
                else {
                    console.log(err);
                }
            });
        }
        getCampusList();
        $scope.addCampus = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addCampus.html',
                controller: 'addCampusCtrl'
             

            }).result.then(function (result) {
                $scope.avatar = result.src;
            }, function () {
                // Cancel
            });
        }
        $scope.addBuilding = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addCampus.html',
                controller: 'addCampusCtrl'


            }).result.then(function (result) {
                $scope.avatar = result.src;
            }, function () {
                // Cancel
            });
        }
        $scope.openPopup = function (campus) {
            
            var modalInstance = $modal.open({
                templateUrl: 'editCampus.html',
                controller: 'editCampusCtrl',
                resolve: {
                    campus: function () {
                        return campus;
                    }
                }               

            }).result.then(function (result) {
                $scope.avatar = result.src;
                }, function () {
                    // Cancel
                });
        };

    });

