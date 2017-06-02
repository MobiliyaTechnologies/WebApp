'use strict';
/**
 * @ngdoc Controller
 * @name controller:overviewCtrl
 * @author Jayesh Lunkad
 * @description 
 * # overviewCtrl
 * 
 */
var map,buldingMap;
var count = 0;
var meterList;
var infobox;
var iframe;
var colors = ['rgba(60,162,224, 0.7)', 'rgba(138, 212, 235, 0.7)', 'rgba(254, 150, 102, 0.7)', 'rgba(95, 107, 109, 0.7)','rgba(253, 98, 94, 0.7)']

angular.module('WebPortal')
    .controller('overviewCtrl', function ($scope, $http, $location, Token, config, $timeout, Restservice ) {
        $scope.userId = localStorage.getItem("userId");
        $scope.premiseList = [];
        $scope.meterList = [];
        $scope.urls = [];
        $scope.back_button = false;

        /**
         * This function would trigger after map get loaded 
         */
        $scope.afterMapLoad = function () {
            var mapLocation = new Microsoft.Maps.Location(40.571276, -105.085522);
            map = new Microsoft.Maps.Map(document.getElementById('mapView'),
                {
                    credentials: 'Ahmc1XzhRQwnhx-_HvtFWJH5y1TOqNaUEOZgzPPHQyyffV8z-UyK3tfrkaEMZpiv',
                    center: mapLocation,
                    zoom: 6,
                    mapTypeId: Microsoft.Maps.MapTypeId.road,

                });
           
            getPremiseList();
        }
        /**
        * Function to get all Building associated with premise
        */
        function getBuildingList(premiseId) {
            Restservice.get('api/GetBuildingsByPremise/' + premiseId, function (err, response) {
                if (!err) {
                    console.log("[Info]  :: Get BuildingsBy Premise ", response);
                    createBasePushPin('building', response);
                }
                else {
                    console.log("[Error]  :: Get BuildingsBy Premise ", err);
                }
            });
        }
        /**
         * Function to get all premise associated with login user 
         */
        function getPremiseList() {
            Restservice.get('api/GetAllPremise', function (err, response) {
                if (!err) {
                    $scope.premiseList = response;
                    createBasePushPin('premise', $scope.premiseList);
                    createColorPushPin('premise', $scope.premiseList);
                    console.log("[Info]  :: Get All Premise ", response);
                    
                }
                else {
                   
                    console.log("[Error]  :: Get all Premise ", err);
                }
            });
        }
        $scope.loadPremise = function () {
            map.entities.clear();
            $scope.back_button = false;
            createBasePushPin('premise', $scope.premiseList);
            createColorPushPin('premise', $scope.premiseList);
        }

        function getPowerBiUrls() {
            $http.get('powerBI.json')
                .then(function (data, status, headers) {
                    $scope.powerBIUrls = data.data;
                    if ($scope.powerBIUrls.premise) {
                        embedReport($scope.powerBIUrls.premise.summary, 'summary');
                        embedReport($scope.powerBIUrls.premise.summarydetails, 'summarydetails');
                    }
                    else {
                        $scope.configurationError = "Please Check Configuration";
                    }
                })
                .catch(function (data, status, headers) {
                    console.log("[Error]  :: Get Power Bi Urls ", err);
                });
        }
        getPowerBiUrls();
        /**
         * 
         * @param entityList
         */
        function createBasePushPin(type,entityList) {
            for (var i = 0; i < entityList.length; i++) {
                var location = new Microsoft.Maps.Location(entityList[i].Latitude, entityList[i].Longitude);
                var pushpin = new Microsoft.Maps.Pushpin(location, {
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="5" fill="black" /></svg>',
                    anchor: new Microsoft.Maps.Point(5, 5)
                });
                map.entities.push(pushpin);
                if(type=='premise'){
                    pushpin.Name = entityList[i].PremiseName;
                    pushpin.ID = entityList[i].PremiseID;
                    pushpin.Type = 'premise';
                }
                else if (type == 'building') {
                    pushpin.Name = entityList[i].BuildingName;
                    pushpin.ID = entityList[i].BuildingID;
                    pushpin.PremiseID = entityList[i].PremiseID;
                    pushpin.Type = 'building';
                }
                Microsoft.Maps.Events.addHandler(pushpin, 'click', onPushpinClicked);
                Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', onPushpinMouseOver);
                Microsoft.Maps.Events.addHandler(pushpin, 'mouseout', onPushpinMouseOut);
            }
        }
        /**
         * 
         * @param meter
         */
        function createColorPushPin(type,entityList) {
            for (var i = 0; i < entityList.length; i++) {
                var location = new Microsoft.Maps.Location(entityList[i].Latitude, entityList[i].Longitude);
                var radius = entityList[i].MonthlyConsumption * 0.001;
                var fillColor = colors[Math.floor(Math.random() * 4) + 0];
                var offset = new Microsoft.Maps.Point(0, 5);
                var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', ((radius + 5) * 2),
                    '" height="', ((radius + 5) * 2), '"><circle cx="', (radius + 5), '" cy="', (radius + 5), '" r="', radius, '" fill="', fillColor, '"/></svg>'];
                
                var pushpin2 = new Microsoft.Maps.Pushpin(location, {
                    icon: svg.join(''),
                    anchor: new Microsoft.Maps.Point(radius, radius), text: entityList[i].PremiseName, textOffset: new Microsoft.Maps.Point(0, 10)

                });
                
                map.entities.push(pushpin2);
                if (type == 'premise') {
                    pushpin2.Name = entityList[i].PremiseName;
                    pushpin2.ID = entityList[i].PremiseID;
                    pushpin2.Type = 'premise';
                }
                else if (type == 'building') {
                    pushpin.Name = entityList[i].BuildingName;
                    pushpin.ID = entityList[i].BuildingID;
                    pushpin.PremiseID = entityList[i].PremiseID;
                    pushpin.Type = 'building';
                }
                Microsoft.Maps.Events.addHandler(pushpin2, 'click', onPushpinClicked);
                Microsoft.Maps.Events.addHandler(pushpin2, 'mouseover', onPushpinMouseOver);
                Microsoft.Maps.Events.addHandler(pushpin2, 'mouseout', onPushpinMouseOut);
            }
        }
        /**
        * 
        * @param args
        */
        function onPushpinClicked(args) {
            
            //$("#scrolldiv").animate({
            //    scrollTop: $("#srollreports").offset().top
            //});
            infobox.setOptions({ visible: false });
            if (args.target.Type == 'premise') {
                map.entities.clear();
                $scope.back_button = true;
                getBuildingList(args.target.ID);
                if ($scope.powerBIUrls.premise) {
                    embedReport($scope.powerBIUrls.premise.summary + "&$filter=Premise/PremiseName eq \'" + args.target.Name + "\'", 'summary');
                    embedReport($scope.powerBIUrls.premise.summarydetails + "&$filter=Premise/PremiseName eq \'" + args.target.Name + "\'", 'summarydetails');
                }
                $scope.$apply();
            }
            else {
                if ($scope.powerBIUrls.building) {
                    var premise = $scope.premiseList.filter(function (obj) {
                        return obj.PremiseID === args.target.PremiseID;
                    })[0];
                    embedReport($scope.powerBIUrls.building.summary + "&$filter=BridgePremiseBuilding/PremiseBuilding eq \'" + premise.PremiseName+ args.target.Name + "\'", 'summary');
                    embedReport($scope.powerBIUrls.building.summarydetails + "&$filter=BridgePremiseBuilding/PremiseBuilding eq \'" + premise.PremiseName+ args.target.Name + "\'", 'summarydetails');
                }
            }
        }

        function embedReport(reportURL, iframeId) {   
            console.log("Report Url", reportURL);
            var embedUrl = reportURL;
            if ("" === embedUrl) {
                console.log("[Error]  :: No embed URL found ", err);
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
                console.log("[Error]  :: Access token not found ");
                return;
            }
            var m = { action: "loadReport", accessToken: accessToken };
            var message = JSON.stringify(m);
            iframe = document.getElementById(iframeId);
            iframe.contentWindow.postMessage(message, "*");;
        }


        function getInsight() {
            Restservice.get('api/GetInsightData', function (err, response) {
                if (!err) {
                    console.log("[Info] :: Get Insight Data ", response);
                    $scope.insight = response;
                    $scope.insight.ConsumptionValue = Math.round($scope.insight.ConsumptionValue)/1000;
                    $scope.insight.PredictedValue = Math.round($scope.insight.PredictedValue)/1000;
                    $scope.insight.overused = response.ConsumptionValue - response.PredictedValue; 
                    if ($scope.insight.overused>0) {
                        $scope.usage = "OVERUSED";
                    }                          
                    else {
                        $scope.usage = "UNDERUSED";
                    }
                }
                else {
                    console.log("[Error]  :: Get Insight Data ", err);

                }

            });
        }
        getInsight();
        function getRecommendation() {
           

            Restservice.get('api/getrecommendations/', function (err, response) {
                if (!err) {
                    $scope.recommendations = response;
                    console.log("[Info]  :: Get recommendation ", response);
                }
                else {
                    console.log("[Error]  :: Get recommendation ", err);
                }

            });
        }
        getRecommendation();
      
        /**
         * 
         * @param args
         */
        function onPushpinMouseOver(args) {
            infobox = new Microsoft.Maps.Infobox(args.target.getLocation(), {
                title: args.target.Name,
                visible: true,
                offset: new Microsoft.Maps.Point(5, 0)
            });
            infobox.setMap(map);
        }
        /**
         * 
         * @param args
         */
        function onPushpinMouseOut(args) {
            infobox.setOptions({ visible: false });
        }  
        

        $scope.flip = function () {
            $('.card').toggleClass('flipped');
        }

        function getSensorList() {         

            Restservice.get('api/GetAllMapSensors', function (err, response) {
                if (!err) {
                    console.log("[Info] :: Get Sensor list response ", response);
                    $scope.sensors = response;
                    $scope.selectedSensor = $scope.sensors[0];

                }
                else {
                    console.log("[Error]:: Get Sensor list response ", err);
                }
            });

        }
        getSensorList();
        $scope.showSensorDetails = function (sensor) {
            $scope.selectedSensor = sensor;
        }

    });


