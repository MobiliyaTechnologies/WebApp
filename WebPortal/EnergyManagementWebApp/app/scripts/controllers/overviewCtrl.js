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
    .controller('overviewCtrl', function ($scope, $http, $location, Token, config, $timeout, Restservice, $rootScope, Alertify, $filter) {
        $scope.userId = localStorage.getItem("userId");
        $scope.premiseList = [];
        $scope.meterList = [];
        $scope.urls = [];
        $scope.back_button = false;
        $scope.configurationError = true;
        $scope.loadingpowerBi = true;
        $scope.powerBIUrls = {
            'organization': {},
            'premise': {},
            'building': {},
            'feedback': {}
        }
        $scope.filter = '';
        $scope.powerBiFilter = '';
        $scope.powerBiFilterIntial = '';
        $scope.selectedBuilding = '';
        $scope.selectedPremise = '';
        $scope.demoCount = 1;
        $scope.demoMode = JSON.parse(localStorage.getItem("demoMode"));
        $scope.premiseState = true;
        if ($scope.demoMode) {
            var data = localStorage.getItem('demoCount');
            $scope.filter = '?DateFilter=' + data;
            $scope.powerBiFilter = " and DateFilter/FilterID eq \'" + data + "\'";
            $scope.powerBiFilterIntial="&$filter=DateFilter/FilterID eq \'" + data + "\'";
            $scope.previousnextHide = true;
            $scope.demoCount = 1;
        }
        else {
            $scope.filter = ''
            $scope.previousnextHide = false;
        }
        var map;
        /**
         * This function would trigger after map get loaded 
         */
        $scope.afterMapLoad = function () {
            var mapLocation = new Microsoft.Maps.Location(40.571276, -105.085522);
            map = new Microsoft.Maps.Map(document.getElementById('mapView'),
                {
                    credentials: 'Ahmc1XzhRQwnhx-_HvtFWJH5y1TOqNaUEOZgzPPHQyyffV8z-UyK3tfrkaEMZpiv',
                    center: mapLocation,
                    zoom: 30,
                    mapTypeId: Microsoft.Maps.MapTypeId.road,

                });
           
            getPremiseList();
        }
        /**
        * Function to get all Building associated with premise
        */
        function getBuildingList(premiseId) {
            Restservice.get('api/GetBuildingsByPremise/' + premiseId+$scope.filter, function (err, response) {
                if (!err) {
                    console.log("[Info]  :: Get BuildingsBy Premise ", response);
                    createBasePushPin('building', response);
                    createColorPushPin('building', response);
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
            
            Restservice.get('api/GetAllPremise' + $scope.filter, function (err, response) {
                if (!err) {
                    $scope.premiseList = response;
                    map.entities.clear();
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
            $scope.premiseState = true;
            createBasePushPin('premise', $scope.premiseList);
            createColorPushPin('premise', $scope.premiseList);
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
                                        $scope.powerBIUrls.premise[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }                                   
                                    getPowerBiUrls(); 
                                    $scope.configurationError = false;
                                   
                                }
                                $scope.loadingpowerBi = false;
                                break;
                            case "BuildingPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkBuildingPowerBI = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.powerBIUrls.building[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }              
                                }
                                break;

                            case "OrganizationPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkUniversityPowerBI = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.powerBIUrls.organization[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }     
                                }

                                break;

                            case "FeedbackPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    $scope.checkFeedbackPowerBI = '#c3f7d0';
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.powerBIUrls.feedback[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }
                                }
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
        function getPowerBiUrls() {
        
                    if ($scope.powerBIUrls.premise) {
                        embedReport($scope.powerBIUrls.premise.summary + $scope.powerBiFilterIntial, 'summary');
                        embedReport($scope.powerBIUrls.premise.summarydetails + $scope.powerBiFilterIntial, 'summarydetails');
                    }          
            

        }
          
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
                map.setView({
                    center: new Microsoft.Maps.Location(entityList[i].Latitude, entityList[i].Longitude),
                    zoom: 10,
                    animate: true

                });
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
                var radius = entityList[i].MonthlyConsumption * 0.0002;                
                radius = radius + 5;
                console.log("radius :", radius);
                var fillColor = colors[i];
                if (radius > 150) {
                    radius = 150;
                }
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
                    pushpin2.Name = entityList[i].BuildingName;
                    pushpin2.ID = entityList[i].BuildingID;
                    pushpin2.PremiseID = entityList[i].PremiseID;
                    pushpin2.Type = 'building';
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
                $scope.premiseState = false;
                $scope.selectedPremise = args.target.Name;
                $scope.selectedPremiseID = args.target.ID;
                map.entities.clear();
                $scope.back_button = true;
                getBuildingList(args.target.ID);
                if ($scope.powerBIUrls.premise) {
                    embedReport($scope.powerBIUrls.premise.summary + "&$filter=Premise/PremiseName eq \'" + args.target.Name + "\'" + $scope.powerBiFilter, 'summary');
                    embedReport($scope.powerBIUrls.premise.summarydetails + "&$filter=Premise/PremiseName eq \'" + args.target.Name + "\'" + $scope.powerBiFilter, 'summarydetails');
                }
                $scope.$apply();
            }
            else {
                if ($scope.powerBIUrls.building) {
                    var premise = $scope.premiseList.filter(function (obj) {
                        return obj.PremiseID === args.target.PremiseID;
                    })[0];
                    $scope.selectedBuilding = premise.PremiseName + args.target.Name;
                    embedReport($scope.powerBIUrls.building.summary + "&$filter=BridgePremiseBuilding/PremiseBuilding eq \'" + premise.PremiseName + args.target.Name + "\'" + $scope.powerBiFilter, 'summary');
                    embedReport($scope.powerBIUrls.building.summarydetails + "&$filter=BridgePremiseBuilding/PremiseBuilding eq \'" + premise.PremiseName + args.target.Name + "\'" + $scope.powerBiFilter, 'summarydetails');
                }
            }
        }

        function embedReport(reportURL, iframeId) { 
            var embedUrl = reportURL;
            console.log("Power Bi Url ::", reportURL);
            if ("" === embedUrl) {
                console.log("[Error]  :: No embed URL found ");
                $scope.configurationError = true;
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
                console.log("[Error]  :: Access token not found ");
                return;
            }
            var m = { action: "loadReport", accessToken: accessToken };
            var message = JSON.stringify(m);
            iframe = document.getElementById(iframeId);
            iframe.contentWindow.postMessage(message, "*");;
        }


        function getInsight() {
            Restservice.get('api/GetInsightData' + $scope.filter, function (err, response) {
                if (!err) {
                    console.log("[Info] :: Get Insight Data ", response);
                    $scope.insight = response;
                    $scope.insight.ConsumptionValue = Math.round($scope.insight.ConsumptionValue)/1000;
                    $scope.insight.PredictedValue = Math.round($scope.insight.PredictedValue)/1000;
                    $scope.insight.overused = response.ConsumptionValue - response.PredictedValue; 
                    if ($scope.insight.overused>0) {
                        $scope.usage = "OVERUSED";
                        $scope.overusedimg = 'up-red';
                    }                          
                    else {
                        $scope.usage = "UNDERUSED";
                        $scope.overusedimg = 'down-green';
                    }
                }
                else {
                    console.log("[Error]  :: Get Insight Data ", err);

                }

            });
        }
        getInsight();
        function getRecommendation() {
           

            Restservice.get('api/getrecommendations' + $scope.filter, function (err, response) {
                if (!err) {
                    $scope.recommendations = response;
                    if ($scope.recommendations.length >= 2) {
                        $rootScope.$broadcast('logMessage', $scope.recommendations[0].Alert_Desc);
                        $rootScope.$broadcast('logMessage', $scope.recommendations[1].Alert_Desc);
                    }
                    else if ($scope.recommendations.length >= 1) {                       
                        $rootScope.$broadcast('logMessage', $scope.recommendations[0].Alert_Desc);
                    }
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
                    //$scope.selectedSensor = $scope.sensors[0];
                    if ($scope.sensors.length > 0) {
                        //subscribeMqtt($scope.sensors[0].Sensor_Id);
                        $scope.Sensor_Name = $scope.sensors[0].Sensor_Name;
                        $scope.selectedSensor = $scope.sensors[0];
                    }
                    for (var i = 0; i < $scope.sensors.length; i++) {
                        subscribeMqtt($scope.sensors[i].Sensor_Id);
                    }
                }
                else {
                    console.log("[Error]:: Get Sensor list response ", err);
                }
            });

        }
        getSensorList();
        $scope.selectedSensor = {
            'Sensor_Name': '',
            'Humidity': '',
            'Brightness': '',
            'Temperature': ''
        }
        $scope.fetchStr = true;
        $scope.Sensor_Name = '';
        $scope.showSensorDetails = function (sensor) {
            console.log("Sensor", sensor);
            
            $scope.Sensor_Name = sensor.Sensor_Name;
            if (sensor.Temperature == 0) {
                $scope.fetchStr = true;
                

            }
            else {
                $scope.fetchStr = false;
                $scope.selectedSensor = sensor;
                console.log("$scope.selectedSensor", $scope.selectedSensor);
            }
        }
        
        $rootScope.$on('demoCount', function (event, data) {
            console.log("Data", data);
            
            $scope.filter = '?DateFilter=' + data;
            $scope.powerBiFilter = " and DateFilter/FilterID eq \'" + data + "\'";
            $scope.powerBiFilterIntial = "&$filter=DateFilter/FilterID eq \'" + data + "\'";
            getInsight();
            getRecommendation();
            if ($scope.premiseState) {
                if ($scope.powerBIUrls.premise) {
                    if ($scope.selectedPremise != '') {
                        embedReport($scope.powerBIUrls.premise.summary + "&$filter=Premise/PremiseName eq \'" + $scope.selectedPremise + "\'" + $scope.powerBiFilter, 'summary');
                        embedReport($scope.powerBIUrls.premise.summarydetails + "&$filter=Premise/PremiseName eq \'" + $scope.selectedPremise + "\'" + $scope.powerBiFilter, 'summarydetails');
                    }
                    else {
                        embedReport($scope.powerBIUrls.premise.summary + $scope.powerBiFilterIntial, 'summary');
                        embedReport($scope.powerBIUrls.premise.summarydetails + $scope.powerBiFilterIntial, 'summarydetails');
                    }
                }
                getPremiseList();
                
            }
            else {

                if ($scope.powerBIUrls.building) {
                    if ($scope.selectedBuilding != '') {
                        embedReport($scope.powerBIUrls.building.summary + "&$filter=BridgePremiseBuilding/PremiseBuilding eq \'" + $scope.selectedBuilding + "\'" + $scope.powerBiFilter, 'summary');
                        embedReport($scope.powerBIUrls.building.summarydetails + "&$filter=BridgePremiseBuilding/PremiseBuilding eq \'" + $scope.selectedBuilding+ "\'" + $scope.powerBiFilter, 'summarydetails');
                    }
                   
                }
                getBuildingList($scope.selectedPremiseID);

            }
            
          
        });


        /*****MQTT******/
        var client = new Paho.MQTT.Client("emdemo.mobiliya.com", Number('1884'), "clientId" + new Date().getTime());
        var mqttstatus = false;
        //var client = new Paho.MQTT.Client("iot.eclipse.org", Number('443'), "clientId" + new Date());
        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        // connect the client
        client.connect({ onSuccess: onConnect, useSSL: true });


        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");
            mqttstatus = true;
            if ($scope.sensors) {
                for (var i = 0; i < $scope.sensors.length; i++) {
                    subscribeMqtt($scope.sensors[i].Sensor_Id);
                }
            }
        }

        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:" + responseObject.errorMessage);
                client.connect({ onSuccess: onConnect, useSSL: true });
                
            }
            mqttstatus = false;
        }

        // called when a message arrives
        function onMessageArrived(message) {
            console.log("onMessageArrived:" + message.payloadString);
            $scope.fetchStr = false;
            $scope.SensorData = JSON.parse(message.payloadString);

            var object = $filter('filter')($scope.sensors, function (d) { return d.Sensor_Id == $scope.SensorData.Sensor_Id; })[0];
            console.log("Sensors", $scope.sensors);
            console.log("$scope.selectedSensor", $scope.SensorData);
            console.log("Object", object);
            var index = $scope.sensors.findIndex(e => e.Sensor_Id == $scope.SensorData.Sensor_Id);
            //var index = object.$$originalIdx;
            console.log("index", index);
            $scope.sensors[index].Humidity = $scope.SensorData.Humidity;
            $scope.sensors[index].Temperature = $scope.SensorData.Temperature;
            $scope.sensors[index].Brightness = $scope.SensorData.Brightness;
            if ($scope.selectedSensor.Sensor_Id == $scope.sensors[index].Sensor_Id) {
                $scope.selectedSensor = $scope.sensors[index];
            }
            $scope.$apply();
        }

        function subscribeMqtt(sensorkey) {
            console.log("SensorKey ::", sensorkey);
            if (mqttstatus) {
                client.subscribe("/emsensors/" + sensorkey);
                $scope.topicSubscribe = "/emsensors/" + sensorkey;
                console.log("Subscribe to topic " + "/emsensors/" + sensorkey)
            }
            
            
        }
        $scope.$on('$destroy', function (event) {
            for (var i = 0; i < $scope.sensors.length; i++) {
                client.subscribe("/emsensors/" + $scope.sensors[i].Sensor_Id);
            }

        });

    });


