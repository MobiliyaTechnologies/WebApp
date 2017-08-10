/**
 * @ngdoc Controller
 * @name controller:feedbackCtrl
 * @author Jayesh Lunkad
 * @description 
 * # feedbackCtrl
 * 
 */
angular.module('WebPortal')
    .controller('feedbackCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config, Restservice, $rootScope) {
        console.log("[Info] :: Feedback Controller loaded");
        $scope.loadingpowerBi = true;
        $scope.configurationError = true;
        $scope.feedbackFilter = '';
        $scope.demoMode = JSON.parse(localStorage.getItem("demoMode"));
        if ($scope.demoMode) {
            $scope.feedbackFilter = " and DateFilter/FilterID eq \'" + localStorage.getItem('demoCount')+"\'";
        }
        $scope.powerBiUrls = {
            'organization': {},
            'premise': {},
            'building': {},
            'feedback': {}
        }
        function getConfig() {

            Restservice.get('api/GetAllApplicationConfiguration', function (err, response) {
                if (!err) {
                    console.log("[Info] :: Get Configuration List", response);
                    for (var i = 0; i < response.length; i++) {
                        switch (response[i].ApplicationConfigurationType) {
                            case "PremisePowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.powerBiUrls.premise[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }
                                }

                                break;
                            case "BuildingPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.powerBiUrls.building[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }
                                }
                                break;

                            case "OrganizationPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.powerBiUrls.organization[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }
                                }

                                break;

                            case "FeedbackPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.powerBiUrls.feedback[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }
                                    $scope.configurationError = false;
                                }
                                $scope.loadingpowerBi = false;
                                break;



                        }
                    }

                }
                else {
                    console.log("[Error]:: Get Configuration Lis", err);
                }
            });

        }
        getConfig();
        
        /**
         * Function to get all Premises  
         */
        function getPremisesList() {          
            Restservice.get('api/GetAllPremise', function (err, response) {
                if (!err) {
                    console.log("[Info] ::Get Premises List ", response);
                    $scope.Premises = response;
                    $scope.selectedPremise = $scope.Premises[0].PremiseID;  
                    $scope.getBuildingList();
                }
                else {
                    console.log("[Error] :: Get Premises List", err);
                }
            });
        }
        getPremisesList();
             

        /**
         * Function to get all classrooms  
         */
        $scope.getBuildingList = function () {
            Restservice.get('api/GetBuildingsByPremise/' + $scope.selectedPremise, function (err, response) {
                if (!err) {
                    console.log("[Info] :: Get BuildingsBy Premise ", response);
                    $scope.Buildings = response;
                    if ($scope.Buildings.length > 0) {
                        $scope.selectedBuilding = $scope.Buildings[0].BuildingID;
                        //console.log("$scope.Buildings", $scope.selectedBuilding);
                        $scope.getClassRoomList();
                    }
                }
                else {
                    console.log("[Error] :: Get BuildingsBy Premise", err);
                }
            });
        }

        /**
        * Function to get all classrooms  
        */
        $scope.getClassRoomList = function() {
            Restservice.get('api/GetRoomByBuilding/' + $scope.selectedBuilding, function (err, response) {
                if (!err) {
                    console.log("[Info] :: Get room for Building ", response);
                    $scope.Classes = response;
                    if ($scope.Classes.length > 0) {
                        $scope.selectedClass = $scope.Classes[0].RoomId;
                        $scope.getSensorList();
                    }
                   
                }
                else {
                    console.log("[Error]:: Get room for Building", err);
                }
            });


        }
        
        /**
        * Function to get sensor list based on selected class 
        */
        $scope.getSensorList = function () {
            var result = null;
            var premise = $scope.Premises.filter(function (obj) {
                return obj.PremiseID === $scope.selectedPremise;
            })[0];
            var building = $scope.Buildings.filter(function (obj) {
                return obj.BuildingID === $scope.selectedBuilding;
            })[0];

            var classes = $scope.Classes.filter(function (obj) {
                return obj.RoomId === $scope.selectedClass;
            })[0];
            $scope.selectedPremiseName = premise.PremiseName;
            $scope.selectedBuildingName = building.BuildingName;
            $scope.selectedClassName = classes.RoomName;
            if ($scope.powerBiUrls.feedback.summary){
                embedReport($scope.powerBiUrls.feedback.summary + "&$filter=BridgeRoomBuilding/PremiseBuildingRoom eq '" + premise.PremiseName + building.BuildingName + classes.RoomName + "'" + $scope.feedbackFilter, 'feedback');
            }
            else {
                $scope.configurationError = true;
            }
            Restservice.get('api/GetAllSensorsForClass/' + $scope.selectedClass, function (err, response) {
                if (!err) {
                    $scope.sensors = response;
                    console.log("[Info] :: Get Sensor List Details ", response);
                }
                else {
                    console.log("[Error]:: Get Sensor List Details", err);
                }
            });
        }
       
        function embedReport(reportURL, iframeId) {
            console.log("Feedback Url::",reportURL);
            var embedUrl = reportURL;
            if ("" === embedUrl) {
                console.log("No embed URL found");
                return;
            }
            $scope.configurationError = false;
            iframe = document.getElementById(iframeId);
            iframe.src = embedUrl;
            iframe.onload = function () {
                postActionLoadReport(iframeId)
            };
        }

        function postActionLoadReport(iframeId) {
            var accessToken = Token.data.accesstoken
            if ("" === accessToken) {
                console.log("Access token not found");
                return;
            }
            var m = { action: "loadReport", accessToken: accessToken };
            var message = JSON.stringify(m);
            iframe = document.getElementById(iframeId);
            iframe.contentWindow.postMessage(message, "*");;
        }

        $rootScope.$on('demoCount', function (event, data) {
            $scope.feedbackFilter = " and DateFilter/FilterID eq \'" + data + "\'";
            if ($scope.powerBiUrls.feedback.summary) {
                embedReport($scope.powerBiUrls.feedback.summary + "&$filter=BridgeRoomBuilding/PremiseBuildingRoom eq '" + $scope.selectedPremiseName + $scope.selectedBuildingName + $scope.selectedClassName + "'" + $scope.feedbackFilter, 'feedback');
            }
        });
    });