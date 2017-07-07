/**
 * @ngdoc Controller
 * @name controller:piconfCtrl
 * @author Jayesh Lunkad
 * @description 
 * # piconfCtrl
 * 
 */
angular.module('WebPortal')
    .controller('piconfCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config, Restservice,$location ) {
        $scope.universityPowerBiConfig = {};
        $scope.premisePowerBiConfig = {};
        $scope.buildingPowerBiConfig = {};
        $scope.feebackPowerBi = {};
        $scope.powerBicredentials = {};
        $scope.firebase = {};
        $scope.organization = {};
        $scope.loading = "display:block;";
        $scope.checkPremisePowerBI = '#f29898';
        $scope.checkBuildingPowerBI = '#f29898';
        $scope.checkAzureMl = '#f29898';
        $scope.checkUniversityPowerBI = '#f29898';
        $scope.checkFeedbackPowerBI = '#f29898';
        $scope.checkFirebase = '#f29898';
        $scope.checkPIserver = '#f29898';
        $scope.checkAddClassroom = '#c3f7d0';
        /**
         * Function to get all Config  
         */
        function getConfigList() {
            Restservice.get('api/GetAllApplicationConfiguration', function (err, response) {
                if (!err) {
                    console.log("[Info] :: Get Configuration List", response);
                    for (var i = 0; i < response.length; i++) {
                        switch (response[i].ApplicationConfigurationType) {
                            case "PremisePowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkPremisePowerBI = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.premisePowerBiConfig[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }
                                    $scope.addPremisePowerBiUrl();
                                }
                                else {
                                    $scope.checkPremisePowerBI = '#f29898';
                                }
                                break;
                            case "BuildingPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkBuildingPowerBI = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.buildingPowerBiConfig[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }      
                                    $scope.addBuildingPowerBiUrl();
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
                            case "OrganizationPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkUniversityPowerBI = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.universityPowerBiConfig[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }  
                                    $scope.addUniPowerBiUrl();
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

                            case "Firebase":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkFirebase = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.firebase[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                        localforage.setItem(response[i].ApplicationConfigurationEntries[j].ConfigurationKey, response[i].ApplicationConfigurationEntries[j].ConfigurationValue);
                                    }
                                }
                                else {
                                    $scope.checkFirebase = '#f29898';
                                }
                                break;

                        }
                    }
                    $scope.checkUser = '#c3f7d0';
                    $scope.checkOrganization = '#c3f7d0';
                    if (Token.data.accesstoken == "" || Token.data.accesstoken == undefined) {
                        $scope.checkPowerBiCredentials = '#f29898';
                    }
                    else {
                        $scope.checkPowerBiCredentials = '#c3f7d0';
                    }
                }
                else {
                    console.log("[Error]:: Get Configuration Lis", err);
                }
            });
        }
        getConfigList();


        $scope.addPiServer = function () {
            var jsonobj = {};
            jsonobj.PremiseID = $scope.selectedPremise;
            jsonobj.PiServerName = $scope.PiServerName;
            jsonobj.PiServerURL = $scope.connectionstring;
            jsonobj.PiServerDesc = $scope.piserverdesc;
            jsonobj.file = document.getElementById('class_schedulefile').files[0];         
            var authResponse = hello('adB2CSignIn').getAuthResponse();
            if (authResponse != null) {
                $http({
                    method: 'POST',
                    url: config.restServer + 'api/AddPiServer',
                    headers: {
                        'Content-Type': undefined,
                        "Authorization": authResponse.token_type + ' ' + authResponse.access_token
                    },
                    data: jsonobj,
                    transformRequest: function (data, headersGetter) {
                        var formData = new FormData();
                        angular.forEach(data, function (value, key) {
                            formData.append(key, value);
                        });

                        var headers = headersGetter();
                        delete headers['Content-Type'];

                        return formData;
                    }
                })
                    .then(function (response) {
                        console.log("[Info] :: Add Pi Server", response);
                    })
                    .catch(function (error) {
                        console.log("[Error] :: Add Pi Server", error);
                    });
            }
        }


        /**
        * Function to get all premise associated with login user 
        */
        $scope.checkPremise = '#f29898';
        function getPremiseList() {
            Restservice.get('api/GetAllPremise', function (err, response) {
                if (!err) {
                    $scope.loading = "display:none;"
                    $scope.premiseList = response;
                    console.log("[Info] :: Get Premise List", response);
                    $scope.Premises = response;
                    
                    if ($scope.Premises.length > 0) {
                        $scope.selectedPremise = $scope.Premises[0].PremiseID;
                        $scope.checkPremise = '#c3f7d0';
                    }
                    else {
                        $scope.checkPremise = '#f29898';
                    }
                }
                else {
                    console.log("[Error]:: Get Premise List", err);
                }
            });
        }
        getPremiseList();
        function getBuildingList() {
            Restservice.get('api/GetAllBuildings', function (err, response) {
                if (!err) {
                    $scope.loading = "display:none;"
                    $scope.buildingList = response;
                    console.log("[Info] :: Get Building List", response);

                    if ($scope.buildingList.length > 0) {
                        $scope.selectedBuilding = $scope.buildingList[0].BuildingID;
                    }

                }
                else {
                    console.log("[Error]:: Get Building List", err);
                }
            });
        }
        getBuildingList();
        $scope.mapPremiseBuilding = function () {
            if ($scope.selectedBuilding) {
                var obj = [];
                obj.push($scope.selectedBuilding);
                document.getElementById("loadingidgq").style.display = "block";
                Restservice.put('api/AddBuildingsToPremise/' + $scope.selectedPremise, obj, function (err, response) {
                    if (!err) {
                        console.log("[Info] :: AddBuildingsToPremise  ", response);
                    }
                    else {
                        console.log("[Error] :: AddBuildingsToPremise ", err);
                    }
                });
                var buildingObj = {
                    'BuildingID': $scope.selectedBuilding,
                    'Latitude': $scope.buildingLat,
                    'Longitude': $scope.buildingLong
                }
                console.log("buildingObj", buildingObj);
                Restservice.put('api/UpdateBuilding', buildingObj, function (err, response) {
                    document.getElementById("loadingidgq").style.display = "none";
                    if (!err) {
                        console.log("[Info] :: UpdateBuilding", response);
                    }
                    else {
                        console.log("[Error] :: UpdateBuilding", err);
                    }
                });
            }
            else{
                console.log("[Error] :: Please Select Building ", err);
            }
        }
        $scope.openSchedulePopup = function (Piserver) {
            var modalInstance = $modal.open({
                templateUrl: 'addSchedule.html',
                controller: 'addScheduleCtrl',
                resolve: {
                    Piserver: function () {
                        return Piserver;
                    }
                }

            }).result.then(function (result) {
                $scope.avatar = result.src;
            }, function () {
                // Cancel
            });
        }
        /**
        * Function to get all user associated with Premise
        */
        function getUserList() {
            Restservice.get('api/GetAllUsers', function (err, response) {
                if (!err) {
                    $scope.userList = response;
                    console.log("[Info] :: Get User List ", response);                 

                }
                else {
                    console.log("[Error]:: Get User List", err);
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
                        $scope.PIserverList = response;
                        $scope.checkPIserver = '#c3f7d0';
                    }
                    else {
                        $scope.checkPIserver = '#f29898';
                     
                    }
                }
                else {
                    console.log("[Error]:: Get All Pi server", err);
                }
            });
        }
        getPIserverList();
        function getOrganizationDetail() {
            Restservice.get('api/GetOrganization', function (err, response) {
                if (!err) {
                    $scope.organization = response;
                    console.log("[Info] :: GetOrganization ", response);

                }
                else {
                    console.log("[Error]:: GetOrganization", err);
                }
            });
        }
        getOrganizationDetail();
        function getRoomList() {
            Restservice.get('api/GetAllRooms', function (err, response) {
                if (!err) {
                    $scope.roomList = response;
                    console.log("[Info] :: api/GetAllRooms ", response);

                }
                else {
                    console.log("[Error]:: api/GetAllRooms", err);
                }
            });

        }
        getRoomList();
        $scope.addPremise = function () {
            
            var modalInstance = $modal.open({
                templateUrl: 'addPremise.html',
                controller: 'addPremiseCtrl'


            }).result.then(function (result) {
                $scope.avatar = result.src;
            }, function () {
                // Cancel
            });
        }
        $scope.addBuilding = function (premise) {
            var modalInstance = $modal.open({
                templateUrl: 'addBuilding.html',
                controller: 'addBuildingCtrl',
                 resolve: {
                     premise: function () {
                         return premise;
                    }
                }

            }).result.then(function (result) {
                $scope.avatar = result.src;
            }, function () {
                // Cancel
            });
        }
        $scope.addRooms=function(){
            $scope.room = {
                file: '',
                building:'1'
            };
            var authResponse = hello('adB2CSignIn').getAuthResponse();
            $scope.room.file = document.getElementById('roomlist').files[0];
            if (authResponse != null && $scope.room.file) {
                document.getElementById("loadingidgq").style.display = "block";
                $http({
                    method: 'POST',
                    url: config.restServer + 'api/AddRoomsToBuilding/' + $scope.selectedBuilding,
                    headers: {
                        'Content-Type': undefined,
                        "Authorization": authResponse.token_type + ' ' + authResponse.access_token
                    },
                    data: $scope.room,
                    transformRequest: function (data, headersGetter) {
                        var formData = new FormData();
                        angular.forEach(data, function (value, key) {
                            formData.append(key, value);
                        });

                        var headers = headersGetter();
                        delete headers['Content-Type'];

                        return formData;
                    }
                })
                    .then(function (response) {
                        document.getElementById("loadingidgq").style.display = "none";
                        console.log("[Info] :: Add Rooms ", response);
                    })
                    .catch(function (error) {
                        document.getElementById("loadingidgq").style.display = "none";
                        console.log("[Error] ::Add Rooms  ", error);
                    });
            }
            else {
                console.log("[Error] ::Please Upload File  ", error);
            }

        }
        $scope.editRoomPopup = function (room) {
            var modalInstance = $modal.open({
                templateUrl: 'editRoom.html',
                controller: 'editRoomCtrl',
                resolve: {
                    room: function () {
                        return room;
                    }
                }

            }).result.then(function (result) {
                $scope.avatar = result.src;
            }, function () {
                // Cancel
            });

        }
        $scope.deleteRoom = function (room) {
            document.getElementById("loadingidgq").style.display = "block";
            Restservice.delete('api/DeleteRoom/' + room.RoomId, function (err, response) {
                    if (!err) {
                        document.getElementById("loadingidgq").style.display = "none";
                        console.log("[Info] :: api/DeleteRoom/' ", response);
                        getRoomList();
                    }
                    else {
                        console.log("[Error]:: api/DeleteRoom/'", err);
                    }
            });


        }
       
        $scope.openPopup = function (premise) {

            var modalInstance = $modal.open({
                templateUrl: 'editPremise.html',
                controller: 'editPremiseCtrl',
                resolve: {
                    premise: function () {
                        return premise;
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
        $scope.addPowerBiCredntials = function () {
            document.getElementById("loadingidgq").style.display = "block";
            $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/PowerBIService.asmx/updatePowerBiCredentials', $scope.powerBicredentials).then(function (data) {
                console.log("[Info] :: Credentials Updated", data);
                document.getElementById("loadingidgq").style.display = "none";
                Token.update(function () { });
            }).catch(function (data) {
                console.log('[Error] ::', data);
            });
        }
        $scope.addUniPowerBiUrl = function () {
            var sampleConfig = {
                "ApplicationConfigurationType": "OrganizationPowerBI",
                "ApplicationConfigurationEntries": [

                ]
            }
            for (key in $scope.universityPowerBiConfig) {
              
                var obj = {  "ConfigurationKey": key, "ConfigurationValue": $scope.universityPowerBiConfig[key] };
                sampleConfig.ApplicationConfigurationEntries.push(obj);
            }
            sendConfigOnServer(sampleConfig);
            updateConfigOnLocal({
                "requestParams": {
                    "Type": "organization",
                    "Values": $scope.universityPowerBiConfig
                }
            });
        }
        $scope.addPremisePowerBiUrl = function () {
            var sampleConfig = {
                "ApplicationConfigurationType": "PremisePowerBI" ,
                "ApplicationConfigurationEntries": [

                ]
            }
            for (key in $scope.premisePowerBiConfig) {
                var obj = { "ConfigurationKey": key, "ConfigurationValue": $scope.premisePowerBiConfig[key] };
                sampleConfig.ApplicationConfigurationEntries.push(obj);
            }
            sendConfigOnServer(sampleConfig);
            updateConfigOnLocal({
                "requestParams": {
                    "Type": "premise",
                    "Values": $scope.premisePowerBiConfig
                }
            });
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
            sendConfigOnServer(sampleConfig);
        }
        $scope.addBlobStorageConfig = function () {
            var sampleConfig = {
                "ApplicationConfigurationType": "BlobStorage",
                "ApplicationConfigurationEntries": [

                ]
            }
            for (key in $scope.azureml) {
                var obj = { "ConfigurationKey": key, "ConfigurationValue": $scope.azureml[key] };
                sampleConfig.ApplicationConfigurationEntries.push(obj);
            }
            //sendConfigOnServer(sampleConfig);
        }
        $scope.addFirebaseConfig = function () {
            var sampleConfig = {
                "ApplicationConfigurationType": "Firebase",
                "ApplicationConfigurationEntries": [

                ]
            }
            for (key in $scope.firebase) {
                var obj = { "ConfigurationKey": key, "ConfigurationValue": $scope.firebase[key] };
                sampleConfig.ApplicationConfigurationEntries.push(obj);
            }
            sendConfigOnServer(sampleConfig);
            updateFirebaseOnLocal($scope.firebase);

        }
        $scope.addOrganizationConfig = function () {
            var authResponse = hello('adB2CSignIn').getAuthResponse();
            $scope.organization.file = document.getElementById('organization_logo').files[0];  
            if (authResponse != null) {

                $http({
                    method: 'POST',
                    url: config.restServer + 'api/AddOrganization',
                    headers: {
                        'Content-Type': undefined,
                        "Authorization": authResponse.token_type + ' ' + authResponse.access_token
                    },
                    data: $scope.organization,
                    transformRequest: function (data, headersGetter) {
                        var formData = new FormData();
                        angular.forEach(data, function (value, key) {
                            formData.append(key, value);
                        });

                        var headers = headersGetter();
                        delete headers['Content-Type'];

                        return formData;
                    }
                })
                    .then(function (response) {
                        console.log("[Info] :: Add Application Config ", response);
                    })
                    .catch(function (error) {
                        console.log("[Error] :: Add Application Config ", error);
                    });
            }


        }
        function sendConfigOnServer(sampleConfig) {
            document.getElementById("loadingidgq").style.display = "block";
            Restservice.post('api/AddApplicationConfiguration', sampleConfig, function (err, response) {
                document.getElementById("loadingidgq").style.display = "none";
                if (!err) {
                    console.log("[Info] :: Add Application Config ", response);
                }
                else {
                    console.log("[Error] :: Add Application Config ", err);
                }
            });
        }
        function updateConfigOnLocal(config) {
            // $http({
            //    url: $location.protocol() + '://' + $location.host() + ':' + $location.port() +'/PowerBIService.asmx/SaveUrl',
            //    dataType: 'json',
            //    method: 'POST',
            //    data: config,
            //    headers: {
            //        "Content-Type": "application/json",
            //    }
            //}).then(function (response) {
            //    console.log("[Info] :: Config Updated in Local ", response);

            //})
            //    .catch(function (error) {
            //        console.log("[Error] ::  Config Not Updated in Local ", error);
            //    });
            //localStorage.setItem(config.requestParams.Type, JSON.stringify(config.requestParams.Values));
        }
        function updateFirebaseOnLocal(config) {
            var obj = {
                'config':config
            }
            $http({
                url: $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/PowerBIService.asmx/updateFirebaseConfig',
                dataType: 'json',
                method: 'POST',
                data: obj,
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(function (response) {
                console.log("[Info] :: Config Updated in Local ", response);

            })
            .catch(function (error) {
                console.log("[Error] ::  Config Not Updated in Local ", err);
            });
        }
    });

angular.module('WebPortal').controller('editPremiseCtrl', function ($scope, $modalInstance, $http, premise, Restservice) {
    $scope.premise = premise;
    
    $scope.ok = function () {

        Restservice.put('api/UpdatePremise', $scope.premise, function (err, response) {
            if (!err) {
                console.log("[Info] :: Premise Updated", response);
                $modalInstance.dismiss('cancel');
            }
            else {
                console.log("[Error] ::  Premise Not Updated  ", err);
            }
        });


    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };





});
angular.module('WebPortal').controller('editRoomCtrl', function ($scope, $modalInstance, $http, room, Restservice) {
    $scope.room = room;

    $scope.ok = function () {

        Restservice.put('api/UpdateRoom', $scope.room, function (err, response) {
            if (!err) {
                console.log("[Info] :: Room Updated", response);
                $modalInstance.dismiss('cancel');
            }
            else {
                console.log("[Error] ::  Room Not Updated  ", err);
            }
        });


    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };





});

angular.module('WebPortal').controller('addPremiseCtrl', function ($scope, $modalInstance, $http, Restservice) {
    
    $scope.premise = {
        PremiseName: '',
        PremiseDesc: '',
        Latitude: '',
        Longitude: '',
    }
    /**
     * Function to Upload Image 
     */
    $scope.ok = function () {
        document.getElementById("loadingidgq").style.display = "block";
        $scope.premise.OrganizationID = localStorage.getItem('organizationID');
        if ($scope.premise.OrganizationID) { 
        Restservice.post('api/AddPremise', $scope.premise, function (err, response) {
            document.getElementById("loadingidgq").style.display = "none";
            if (!err) {
                $scope.loading = "display:none;";
                console.log("[Info] :: Premise Added", response);
                $modalInstance.dismiss('cancel');
            }
            else {
                console.log("[Error] ::  Premise Not Added  ", err);
            }
        });
        }
        else {
            console.log("[Error] :: Pleas Add Organization Details");
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});

angular.module('WebPortal').controller('addBuildingCtrl', function ($scope, $modalInstance, $http, Restservice, premise) {
   
    $scope.building = {
        BuildingName	: '',
        BuildingDesc: '',
        Latitude: '',
        Longitude: '',
        PremiseID:premise.PremiseID	
    }
    /**
     * Function to Upload Image 
     */
    $scope.ok = function () {        
        $scope.loading = "display:block;"
        Restservice.post('api/AddBuilding' , $scope.building, function (err, response) {
            if (!err) {
                $scope.loading = "display:none;"
                console.log("[Info] :: Building Added", response);
                $modalInstance.dismiss('cancel');
            }
            else {
                console.log("[Error] ::  Building Not Added  ", err);
            }
        });


    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});

angular.module('WebPortal').controller('changeRoleCtrl', function ($scope, $modalInstance, $http, Restservice, user, $modal) {
    function getAllRoles() {
    Restservice.get('api/GetAllRoles', function (err, response) {
        if (!err) {
            console.log("[Info] :: Get all roles ", response);
            $scope.roles = response;
            $scope.selectedRole = {
                selected: response[0]
            }
        }
        else {
            console.log("[Error] ::  Get all roles  ", err);
        }
    });
    }
    getAllRoles();
    $scope.userName = user.FirstName +' '+ user.LastName;
    
    /**
     * Function to Upload Image 
     */
    $scope.ok = function () {
        document.getElementById("loadingidgq").style.display = "block";
        Restservice.put('api/AssignRoleToUser/' + user.UserId + '/' + $scope.selectedRole.selected.Id, null, function (err, response) {
            document.getElementById("loadingidgq").style.display = "none";
            if (!err) {
                $scope.loading = "display:none;"
                console.log("[Info] :: Assign Role to user  ", response);
                $modalInstance.dismiss('cancel');
            }
            else {
                console.log("[Error] ::  Assign Role to user   ", err);
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
  
    $scope.role = {
        'RoleName': '',
        'Description': '',
        'PremiseIds':[]
    };
    $scope.CategoriesSelected = [];
    $scope.Categories = [];
    $scope.dropdownSetting = {
        scrollable: true,
        scrollableHeight: '200px'
    }
   
    

    
    $scope.ok = function () {
        if ($scope.CategoriesSelected.length > 0) {       
            $scope.CategoriesSelected.forEach(function (category) {
                $scope.role.PremiseIds.push(category.id);
            });
            document.getElementById("loadingidgq").style.display = "block";
            Restservice.post('api/AddRole', $scope.role, function (err, response) {
                document.getElementById("loadingidgq").style.display = "none";
                if (!err) {
                    $scope.loading = "display:none;";
                    $modalInstance.dismiss('cancel');
                }
                else {
                    console.log("[Error] :: Add role  ", err);
                }
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('WebPortal').controller('addScheduleCtrl', function (config,$scope, $modalInstance, $http, Restservice, $modal, Piserver) {
     
    $scope.Piserver = Piserver;
    $scope.ok = function () {
        var jsonobj = {};
        jsonobj.PIserverID = Piserver.PiServerID;
        jsonobj.file = document.getElementById('class_schedulefile').files[0];
        if (jsonobj.file) {
            console.log(jsonobj);
            var authResponse = hello('adB2CSignIn').getAuthResponse();
            document.getElementById("loadingidgq").style.display = "block";
            if (authResponse != null) {
                $http({
                    method: 'PUT',
                    url: config.restServer + 'api/UpdatePiServer ',
                    headers: {
                        'Content-Type': undefined,
                        "Authorization": authResponse.token_type + ' ' + authResponse.access_token
                    },
                    data: jsonobj,
                    transformRequest: function (data, headersGetter) {
                        var formData = new FormData();
                        angular.forEach(data, function (value, key) {
                            formData.append(key, value);
                        });

                        var headers = headersGetter();
                        delete headers['Content-Type'];

                        return formData;
                    }
                })
                    .then(function (response) {
                        document.getElementById("loadingidgq").style.display = "none";
                        console.log("[Info] :: Update Pi Server", response);
                    })
                    .catch(function (error) {
                        document.getElementById("loadingidgq").style.display = "none";
                        console.log("[Error] :: Update Pi Server", error);
                    });
            }

        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});