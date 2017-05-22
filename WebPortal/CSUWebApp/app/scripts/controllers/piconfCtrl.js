angular.module('WebPortal')
    .controller('piconfCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config, Restservice,$location ) {
        $scope.universityPowerBiConfig = {};
        $scope.campusPowerBiConfig = {};
        $scope.buildingPowerBiConfig = {};
        $scope.feebackPowerBi = {};

        /**
         * Function to get all Config  
         */
        function getConfigList() {
            Restservice.get('api/GetAllApplicationConfiguration', function (err, response) {
                if (!err) {
                    console.log("Get Configuration List [Info]", response);
                    for (var i = 0; i < response.length; i++) {
                        switch (response[i].ApplicationConfigurationType) {
                            case "CampusPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkCampusPowerBI = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.campusPowerBiConfig[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }  
                                }
                                else {
                                    $scope.checkCampusPowerBI = '#f29898';
                                }
                                break;
                            case "BuildingPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkBuildingPowerBI = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.buildingPowerBiConfig[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }      
                                }
                                else {
                                    $scope.checkBuildingPowerBI = '#f29898';
                                }
                                break;
                            case "AzureML":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkAzureMl = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.azureml[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    } 
                                }
                                else {
                                    $scope.checkAzureMl = '#f29898';
                                }
                                break;
                            case "UniversityPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkUniversityPowerBI = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.universityPowerBiConfig[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }                                    
                                }
                                else {
                                    $scope.checkUniversityPowerBI = '#f29898';
                                }
                                break;
                            case "BlobStorage":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkBlobStrorage = '#c3f7d0';
                                }
                                else {
                                    $scope.checkBlobStrorage = '#f29898';
                                }
                                break;
                            case "FeedbackPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkFeedbackPowerBI = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.feebackPowerBi[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }
                                }
                                else {
                                    $scope.checkFeedbackPowerBI = '#f29898';
                                }
                            break;

                        }
                    }
                    $scope.checkUser = '#c3f7d0';
                }
                else {
                    console.log(err);
                }
            });
        }
        getConfigList();


        $scope.addPiServer = function () {
            var jsonobj = {};
            jsonobj.CampusID = $scope.selectedCampus;
            jsonobj.PiServerName = $scope.PiServerName;
            jsonobj.PiServerURL = $scope.connectionstring;
            jsonobj.PiServerDesc = $scope.piserverdesc;

            console.log(jsonobj);
            Restservice.post('api/AddPiServer', jsonobj, function (err, response) {
                if (!err) {
                    console.log("Response", response)
                }
                else {
                    console.log(err);
                }
            });
        }


        /**
        * Function to get all campus associated with login user 
        */
        function getCampusList() {
            Restservice.get('api/GetAllCampus', function (err, response) {
                if (!err) {
                    $scope.campusList = response;
                    console.log("Get Campus List [Info]", response);
                    $scope.Campuses = response;
                    $scope.selectedCampus = $scope.Campuses[0].CampusID;
                    if ($scope.Campuses.length > 0) {
                        $scope.checkCampus = '#c3f7d0';
                    }
                    else {
                        $scope.checkCampus = '#f29898';
                    }
                }
                else {
                    console.log(err);
                }
            });
        }
        getCampusList();
        /**
        * Function to get all user associated with campus
        */
        function getUserList() {
            Restservice.get('api/GetAllUsers', function (err, response) {
                if (!err) {
                    $scope.userList = response;
                    console.log("Get User List [Info]", response);                 

                }
                else {
                    console.log(err);
                }
            });
        }
        getUserList();

        /**
       * Function to get all PIserver 
       */
        function getPIserverList() {
            Restservice.get('api/GetAllPiServers', function (err, response) {
                if (!err) {                   
                    if (response.length > 0) {
                        $scope.checkPIserver = '#c3f7d0';
                    }
                    else {
                        $scope.checkPIserver = '#f29898';
                    }
                }
                else {
                    console.log(err);
                }
            });
        }
        getPIserverList();
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
        $scope.addBuilding = function (campus) {
            var modalInstance = $modal.open({
                templateUrl: 'addBuilding.html',
                controller: 'addBuildingCtrl',
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
        $scope.changeRolePopup = function (user) {

            var modalInstance = $modal.open({
                templateUrl: 'changeRole.html',
                controller: 'changeRoleCtrl',
                resolve: {
                    user: function () {
                        return user;
                    }
                }

            }).result.then(function (result) {
                $scope.avatar = result.src;
            }, function () {
                // Cancel
            });
        };
        $scope.addUniPowerBiUrl = function () {
            var sampleConfig = {
                "ApplicationConfigurationType": "UniversityPowerBI",
                "ApplicationConfigurationEntries": [

                ]
            }
            for (key in $scope.universityPowerBiConfig) {
              
                var obj = {  "ConfigurationKey": key, "ConfigurationValue": $scope.universityPowerBiConfig[key] };
                sampleConfig.ApplicationConfigurationEntries.push(obj);
            }
            console.log(sampleConfig);
            sendConfigOnServer(sampleConfig);
            updateConfigOnLocal({
                "requestParams": {
                    "Type": "university",
                    "Values": $scope.universityPowerBiConfig
                }
            });
        }
        $scope.addCampusPowerBiUrl = function () {
            var sampleConfig = {
                "ApplicationConfigurationType": "CampusPowerBI" ,
                "ApplicationConfigurationEntries": [

                ]
            }
            for (key in $scope.campusPowerBiConfig) {
                var obj = { "ConfigurationKey": key, "ConfigurationValue": $scope.campusPowerBiConfig[key] };
                sampleConfig.ApplicationConfigurationEntries.push(obj);
            }
            console.log(sampleConfig);
            sendConfigOnServer(sampleConfig);
            updateConfigOnLocal({
                "requestParams": {
                    "Type": "campus",
                    "Values": $scope.campusPowerBiConfig
                }
            });
            //updateConfigOnLocal({ 'university': $scope.campusPowerBiConfig });
        }
        $scope.addBuildingPowerBiUrl = function () {
            var sampleConfig = {
                "ApplicationConfigurationType": "BuildingPowerBI ",
                "ApplicationConfigurationEntries": [

                ]
            }
            for (key in $scope.buildingPowerBiConfig) {
                var obj = {  "ConfigurationKey": key, "ConfigurationValue": $scope.buildingPowerBiConfig[key] };
                sampleConfig.ApplicationConfigurationEntries.push(obj);
            }
            console.log(sampleConfig);
            sendConfigOnServer(sampleConfig);
            updateConfigOnLocal({
                "requestParams": {
                    "Type": "building",
                    "Values": $scope.buildingPowerBiConfig
                }
            });
        }
        $scope.addFeedbackPowerBiUrl = function () {
            var sampleConfig = {
                "ApplicationConfigurationType": "FeedbackPowerBI ",
                "ApplicationConfigurationEntries": [

                ]
            }
            for (key in $scope.feebackPowerBi) {
                var obj = { "ConfigurationKey": key, "ConfigurationValue": $scope.feebackPowerBi[key] };
                sampleConfig.ApplicationConfigurationEntries.push(obj);
            }
            console.log(sampleConfig);
            sendConfigOnServer(sampleConfig);
            updateConfigOnLocal({
                "requestParams": {
                    "Type": "feedback",
                    "Values": $scope.feebackPowerBi
                }
            });
        }
        $scope.addAzureMlConfig = function () {
            var sampleConfig = {
                "ApplicationConfigurationType": "AzureML",
                "ApplicationConfigurationEntries": [

                ]
            }
            for (key in $scope.azureml) {
                var obj = { "ConfigurationKey": key, "ConfigurationValue": $scope.azureml[key] };
                sampleConfig.ApplicationConfigurationEntries.push(obj);
            }
            console.log(sampleConfig);
            //sendConfigOnServer(sampleConfig);
        }
        $scope.addBlobStorageConfig = function () {
            var sampleConfig = {
                "ApplicationConfigurationType": "BlobStorage",
                "ApplicationConfigurationEntries": [

                ]
            }
            for (key in $scope.azureml) {
                var obj = { "ConfigKey": key, "ConfigValue": $scope.azureml[key] };
                sampleConfig.ApplicationConfigurationEntries.push(obj);
            }
            console.log(sampleConfig);
            //sendConfigOnServer(sampleConfig);
        }
        function sendConfigOnServer(sampleConfig) {
            Restservice.post('api/AddApplicationConfiguration', sampleConfig, function (err, response) {
                if (!err) {
                    console.log("Response", response)
                }
                else {
                    console.log(err);
                }
            });
        }
        function updateConfigOnLocal(config) {
            //$http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/PowerBIService.asmx/updateConfig', null).then(function (data) {
            //    console.log(data);
            //}).catch(function (data) {
            //    console.log(':(', data);
            //    });
            console.log(config);
            $http({
                url: $location.protocol() + '://' + $location.host() + ':' + $location.port() +'/PowerBIService.asmx/SaveUrl',
                dataType: 'json',
                method: 'POST',
                data: config,
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(function (response) {
                console.log(response);

            })
                .catch(function (error) {
                    console.log(error);
                });
        }
    });

angular.module('WebPortal').controller('editCampusCtrl', function ($scope, $modalInstance, $http, campus, Restservice) {
    console.log("Campus", campus);
    $scope.campus = campus;


    /**
     * Function to Upload Image 
     */
    $scope.ok = function () {

        console.log($scope.campus);
        Restservice.put('api/UpdateCampus', $scope.campus, function (err, response) {
            if (!err) {
                console.log("Response", response);
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

angular.module('WebPortal').controller('addCampusCtrl', function ($scope, $modalInstance, $http, Restservice) {
    $scope.campus = {
        CampusName: '',
        CampusDesc: '',
        Latitude: '',
        Longitude: '',
        UniversityID: 1
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
        console.log("Jsononj", $scope.campus);
        Restservice.post('api/AddCampus', $scope.campus, function (err, response) {
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

angular.module('WebPortal').controller('addBuildingCtrl', function ($scope, $modalInstance, $http, Restservice, campus) {
   
    $scope.building = {
        BuildingName	: '',
        BuildingDesc: '',
        Latitude: '',
        Longitude: '',
        CampusID:campus.CampusID	
    }
    /**
     * Function to Upload Image 
     */
    $scope.ok = function () {        
        console.log("Jsononj", $scope.building);
        Restservice.post('api/AddBuilding' , $scope.building, function (err, response) {
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

angular.module('WebPortal').controller('changeRoleCtrl', function ($scope, $modalInstance, $http, Restservice, user, $modal) {
    console.log("User", user);
    function getAllRoles() {
    Restservice.get('api/GetAllRoles', function (err, response) {
        if (!err) {
            console.log(response);
            $scope.roles = response;
            $scope.selectedRole = {
                selected: response[0]
            }
        }
        else {
            console.log(err);
        }
    });
    }
    getAllRoles();
    $scope.userName = user.FirstName +' '+ user.LastName;
    
    /**
     * Function to Upload Image 
     */
    $scope.ok = function () {
        Restservice.put('api/AssignRoleToUser/' + user.UserId + '/' + $scope.selectedRole.selected.Id, null, function (err, response) {
            if (!err) {
                console.log("Response", response);
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
    $scope.addRole = function () {
        var modalInstance = $modal.open({
            templateUrl: 'addRole.html',
            controller: 'addRoleCtrl',
           

        }).result.then(function (result) {
            getAllRoles();
        }, function () {
            // Cancel
            getAllRoles();
        });
    }

});

angular.module('WebPortal').controller('addRoleCtrl', function ($scope, $modalInstance, $http, Restservice, $modal) {
  
    $scope.names = ["Emil", "Tobias", "Linus"];
    $scope.cars = [{ id: 1, label: 'Audi' }, { id: 2, label: 'BMW' }, { id: 3, label: 'Honda' }];
    $scope.selectedCar = [];
    $scope.role = {
        'RoleName': '',
        'Description': '',
        'CampusIds':[]
    };
    $scope.CategoriesSelected = [];
    $scope.Categories = [];
    $scope.dropdownSetting = {
        scrollable: true,
        scrollableHeight: '200px'
    }
    Restservice.get('api/GetAllCampus', function (err, response) {
        if (!err) {
            $scope.campus= response;
            $scope.campus.forEach(function (campus) {
                campus.id = campus.CampusID;
                 campus.label = campus.CampusName;
            });

        }
        else {
            console.log(err);
        }
    });
    

    
    $scope.ok = function () {
        if ($scope.CategoriesSelected.length > 0) {       
            $scope.CategoriesSelected.forEach(function (category) {
                $scope.role.CampusIds.push(category.id);
            });
            console.log($scope.role);
            Restservice.post('api/AddRole', $scope.role, function (err, response) {
                if (!err) {
                    console.log("Response", response)
                    $modalInstance.dismiss('cancel');
                }
                else {
                    console.log(err);
                }
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});