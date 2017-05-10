angular.module('WebPortal')
    .controller('feedbackCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, config, Restservice ) {
        console.log("[Info] :: Feedback Controller loaded");
        
        /**
         * Function to get all campus  
         */
        function getCampusList() {          
            Restservice.get('api/GetAllCampus', function (err, response) {
                if (!err) {
                    console.log("Get Campus List [Info]", response);
                    $scope.Campuses = response;
                    $scope.selectedCampus = $scope.Campuses[0].CampusID;  
                    $scope.getBuildingList();
                    $scope.$apply();
                }
                else {
                    console.log(err);
                }
            });
        }
        getCampusList();
             

        /**
         * Function to get all classrooms  
         */
        $scope.getBuildingList = function () {
            Restservice.get('api/GetBuildingsByCampus/' + $scope.selectedCampus, function (err, response) {
                if (!err) {
                    console.log("Get BuildingsBy Campus :: [Info]", response);
                    $scope.Buildings = response;
                    $scope.selectedBuilding = $scope.Buildings[0].BuildingID;
                    $scope.getClassRoomList();
                    $scope.$apply();
                }
                else {
                    console.log(err);
                }
            });
        }

        /**
        * Function to get all classrooms  
        */
        $scope.getClassRoomList = function() {
            Restservice.get('api/GetClassroomByBuilding/' + $scope.selectedBuilding, function (err, response) {
                if (!err) {
                    console.log("Get Classroom for Building :: [Info]", response);
                    $scope.Classes = response;
                    $scope.selectedClass = $scope.Classes[0].ClassId;
                    $scope.getSensorList();
                  
                    $scope.$apply();
                }
                else {
                    console.log(err);
                }
            });


        }
        
        /**
        * Function to get sensor list based on selected class 
        */
        $scope.getSensorList = function () {
            console.log($scope.selectedClass);
            var result = null;
            var campus = $scope.Campuses.filter(function (obj) {
                return obj.CampusID === $scope.selectedCampus;
            })[0];
            var building = $scope.Buildings.filter(function (obj) {
                return obj.BuildingID === $scope.selectedBuilding;
            })[0];

            var classes = $scope.Classes.filter(function (obj) {
                return obj.ClassId === $scope.selectedClass;
            })[0];     
            
            embedReport("https://app.powerbi.com/reportEmbed?reportId=d794e930-b85f-4270-8c23-de2e64fd98d0&$filter=BridgeClassroomBuilding/CampusBuildingClass eq '" + campus.CampusName + building.BuildingName + classes.ClassName+"'", 'feedback');
            Restservice.get('api/GetAllSensorsForClass/' + $scope.selectedClass, function (err, response) {
                if (!err) {
                    $scope.sensors = response;
                    console.log("[Info] ::Get Sensor List Details ", response);
                    $scope.$apply();
                }
                else {
                    console.log(err);
                }
            });
        }

        function embedReport(reportURL, iframeId) {
            console.log(reportURL);
            var embedUrl = reportURL;
            if ("" === embedUrl) {
                console.log("No embed URL found");
                return;
            }
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


    });