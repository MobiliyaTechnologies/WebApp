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

angular.module('WebPortal').controller('editCampusCtrl', function ($scope, $modalInstance, $http, campus, Restservice ) {
    console.log("Campus", campus);
    $scope.campus = campus;
    

    /**
     * Function to Upload Image 
     */
    $scope.ok = function () {
        
        console.log($scope.campus);        
        Restservice.put('api/UpdateCampus', $scope.campus,function (err, response) {
            if (!err) {
                console.log("Response",response)
            }
            else {
                console.log(err);
            }
        });


    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };





    });

angular.module('WebPortal').controller('addCampusCtrl', function ($scope, $modalInstance, $http, Restservice) {
    $scope.campus = {
        CampusName: '',
        CampusDesc: '',
        Latitude: '',
        Longitude: '',
        UniversityID:1
    }
    /**
     * Function to Upload Image 
     */
    $scope.ok = function () {
        //var JSONobj = new Object();
        //JSONobj.CampusName = $scope.campusName;
        //JSONobj.CampusDesc = $scope.campusDesc;
        //JSONobj.Latitude = $scope.latitude;
        //JSONobj.Longitude = $scope.longitude;
        //JSONobj.UniversityID = 4;
        console.log("Jsononj", $scope.campus );
        Restservice.post('api/AddCampus', $scope.campus,function (err, response) {
            if (!err) {
                console.log("Response", response)
                $modalInstance.dismiss('cancel');
            }
            else {
                console.log(err);
            }
        });


    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };





});