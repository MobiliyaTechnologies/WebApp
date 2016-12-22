'use strict';
/**
 * @ngdoc function
 * @name angulartestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angulartestApp
 */
var map;
var count = 0;
var meterList;
var infobox;
var iframe;




var tileEmbedURL = "https://app.powerbi.com/embed?dashboardId=37f666c4-8a0b-4b5e-bf61-6151f38dae34&tileId=1ae30b7e-6577-4c5f-8611-905f9a579899";
var donutTileURL = "https://app.powerbi.com/embed?dashboardId=37f666c4-8a0b-4b5e-bf61-6151f38dae34&tileId=817c8e3b-e17b-4a6a-8530-6272835b4374";

angular.module('WebPortal')
    .controller('overviewCtrl', function ($scope, $http, $location, Token, config) {
        $scope.userId = localStorage.getItem("userId");
        $scope.meterList = [];
        $scope.loadMapScenario = function () {
            var mapLocation = new Microsoft.Maps.Location(40.571276, -105.085522);
            map = new Microsoft.Maps.Map(document.getElementById('myMap1'),
                {
                    credentials: 'Ahmc1XzhRQwnhx-_HvtFWJH5y1TOqNaUEOZgzPPHQyyffV8z-UyK3tfrkaEMZpiv',
                    center: mapLocation,
                    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                    zoom: 18
                });
                getMeterList();

        }
       
        function getMeterList() {
            $http({
                url: config.restServer + "api/getmeterlist/" + $scope.userId,
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log("Get Meter List [Info] ::",response);
                $scope.meterList = response;
                getMonthlyConsumption();
                getUrls(0);
                for (var i in $scope.meterList) {
                    createBasePushPin($scope.meterList[i]);
                }

            })
            .error(function (error) {
                    alert("Error : " + JSON.stringify(error));
            });
        }
        $scope.urls = [];
        function getUrls(index) {
            if (index < $scope.meterList.length) {
                $http({
                    url: config.restServer + "api/getpowerbiurl/" + $scope.userId + '/' + $scope.meterList[index].Serial,
                    dataType: 'json',
                    method: 'Get',
                }).success(function (response) {
                    console.log("Get Meter Urls of " + $scope.meterList[index].Serial + "::", response);
                    getUrls(index + 1);
                })
                .error(function (error) {
                       // alert("Error : " + JSON.stringify(error));
                });
            }
        }
        function getMonthlyConsumption() {
            $http({
                url: config.restServer + "api/getmonthlyconsumption/" + $scope.userId,
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log("Get Monthly Consumption [Info] ::", response);
                $scope.MonthlyConsumption = response;
                $scope.options = {
                    dataTextField: 'Powerscout',
                    dataSource: $scope.MonthlyConsumption

                }
               // $scope.$apply();
                for (var j in $scope.meterList) {
                    var index = $scope.MonthlyConsumption.findIndex(function (item, i) {
                        return item.Powerscout == $scope.meterList[j].Serial;
                    });
                    
                    if (index > 0) {
                        $scope.MonthlyConsumption[index].Latitude = $scope.meterList[j].Latitude;
                        $scope.MonthlyConsumption[index].Longitude = $scope.meterList[j].Longitude;
                        $scope.MonthlyConsumption[index].Name = $scope.meterList[j].Name;

                        createColorPushPin($scope.MonthlyConsumption[index]);
                    }
                    }
            })
            .error(function (error) {
                 alert("Error : " + JSON.stringify(error));
            });
        }
        function createBasePushPin(meter) {
            var location = new Microsoft.Maps.Location(meter.Latitude, meter.Longitude);
            var pushpin = new Microsoft.Maps.Pushpin(location, {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="5" fill="black" /></svg>',
                anchor: new Microsoft.Maps.Point(5, 5)
            });
                  
            map.entities.push(pushpin);
            pushpin.MeterName = meter.Name;
            Microsoft.Maps.Events.addHandler(pushpin, 'click', onPushpinClicked);
            Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', onPushpinMouseOver);
            Microsoft.Maps.Events.addHandler(pushpin, 'mouseout', onPushpinMouseOut);
        }
        function createColorPushPin(meter) {
            var location = new Microsoft.Maps.Location(meter.Latitude, meter.Longitude);
            var radius = 0;
            
            var fillColor = 'rgba(60,162,224, 0.7)';
            if (meter.Powerscout == 'P371602077') {
                fillColor = 'rgba(138, 212, 235, 0.7)';
            }
            else if (meter.Powerscout == 'P371602079') {
                fillColor = 'rgba(254, 150, 102, 0.7)';
            }
            else if (meter.Powerscout == 'P371602073') {
                fillColor = 'rgba(242, 200, 15, 0.7)';
            }
            else if (meter.Powerscout == 'P371602072') {
                fillColor = 'rgba(253, 98, 94, 0.7)';
            }
            else if (meter.Powerscout == 'P371602070') {


            }
            else if (meter.Powerscout == 'P371602075') {

                fillColor = 'rgba(95, 107, 109, 0.7)';
            }
            if (meter.Monthly_KWH_Consumption == 0) {
                radius = 0;
            }
            else if (meter.Monthly_KWH_Consumption > 0 && meter.Monthly_KWH_Consumption <= 1000) {
                if (meter.Monthly_KWH_Consumption < 500) {
                    //Minimum radius for the circle
                    radius = 10;
                }
                else {
                    radius = meter.Monthly_KWH_Consumption / 50;
                }
            }
            else if (meter.Monthly_KWH_Consumption > 1000 && meter.Monthly_KWH_Consumption <= 10000) {
                if (meter.Monthly_KWH_Consumption < 5250) {
                    //Minimum radius for the circle
                    radius = 21;
                }
                else {
                    radius = meter.Monthly_KWH_Consumption / 250;
                }
            }
            else if (meter.Monthly_KWH_Consumption > 10000 && meter.Monthly_KWH_Consumption <= 50000) {
                if (meter.Monthly_KWH_Consumption < 25625) {
                    //Minimum radius for the circle
                    radius = 41;
                }
                else {
                    radius = meter.Monthly_KWH_Consumption / 625;
                }
            }
            else {
                if (meter.Monthly_KWH_Consumption < 61000) {
                    //Minimum radius for the circle
                    radius = 61;
                }
                else {
                    radius = meter.Monthly_KWH_Consumption / 1000;
                }
            }
            var offset = new Microsoft.Maps.Point(0, 5); 
            var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', ((radius + 5) * 2),
                '" height="', ((radius + 5) * 2), '"><circle cx="', (radius + 5), '" cy="', (radius + 5), '" r="', radius, '" fill="', fillColor, '"/></svg>'];

            var pushpin2 = new Microsoft.Maps.Pushpin(location, {
                icon: svg.join(''),
                anchor: new Microsoft.Maps.Point(radius, radius), text: meter.Name, textOffset: new Microsoft.Maps.Point(0, 10)

            });
           

            pushpin2.MeterName = meter.Name;
            pushpin2.Monthly_Electric_Cost = meter.Monthly_Electric_Cost;
            pushpin2.Monthly_KWH_Consumption = meter.Monthly_KWH_Consumption;
            map.entities.push(pushpin2);
            Microsoft.Maps.Events.addHandler(pushpin2, 'click', onPushpinClicked);         
            Microsoft.Maps.Events.addHandler(pushpin2, 'mouseover', onPushpinMouseOver);
            Microsoft.Maps.Events.addHandler(pushpin2, 'mouseout', onPushpinMouseOut);
        }
       
        function onPushpinClicked(args) {
           
            //$scope.selectedMeterName = args.target.MeterName;
            //$scope.selectedMontlyConsumption = args.target.Monthly_Electric_Cost;
            //$scope.selectCost = args.target.Monthly_Electric_Cost;
            //document.getElementById("iFrameEmbedTile").style.display = 'none';
            console.log(document.getElementById("reportdd"));
            console.log("click");
            
            $("#scrolldiv").animate({
                scrollTop: $("#reportdd").offset().top
            });
            
        }

        function onPushpinMouseOver(args) {
            infobox = new Microsoft.Maps.Infobox(args.target.getLocation(), {
                title: args.target.MeterName,
               // description: 'Consumption: ' + args.target.MeterMontlyConsumption,
                visible: true,
                offset: new Microsoft.Maps.Point(5, 0)
            });
            infobox.setMap(map);
        }

        function onPushpinMouseOut(args) {
            infobox.setOptions({ visible: false });
        }
            

        var width = 400;
        var height = 380;

        function embedTile() {
            // check if the embed url was selected
            var embedTileUrl = tileEmbedURL;
            if ("" === embedTileUrl) {
                console.log("No embed URL found [Error] ::");
                return;
            }
            iframe = document.getElementById('iFrameEmbedTile');
            iframe.src = embedTileUrl;
            iframe.onload = postActionLoadTile;
        }


        function postActionLoadTile() {
            // get the access token.
            console.log("Tile Loading");
            var accessToken = Token.data.accesstoken;
        
            
            if ("" === accessToken) {
                console.log("Access token not found [Error] ::");
                return;
            }
            $scope.setIFrameSize();
           
        }

        function embedWeatherTile() {
            var embedTileUrl = donutTileURL;
            if ("" === embedTileUrl) {
                console.log("No embed URL found [Error] ::");
                return;
            }
            iframe = document.getElementById('weatherIFrame');
            iframe.src = embedTileUrl ;
            iframe.onload = postActionWeatherLoadTile;
        }

        function postActionWeatherLoadTile() {
            var accessToken = Token.data.accesstoken;
            if ("" === accessToken) {
                console.log("Access token not found [Error] ::");
                return;
            }
            $scope.setIFrameSize();
            
        }
        if (Token.data.accesstoken != '') {
            displayGraph();
        }
        else {
            Token.update(displayGraph);
        }
        function displayGraph() {
            embedTile();
            embedWeatherTile();
        }


        $scope.setIFrameSize = function () {
            var ogWidth = 700;
            var ogHeight = 900;
            var ogRatio = ogWidth / ogHeight;
            var windowWidth = $(window).width();
            //if (windowWidth < 480) {
            var parentDivWidth = $(".iframe-class").parent().width();
            var newHeight = (parentDivWidth / ogRatio);
            $(".iframe-class").addClass("iframe-class-resize");
            $(".iframe-class-resize").css("width", parentDivWidth);
            $(".iframe-class-resize").css("height", newHeight);
            var accessToken = Token.data.accesstoken;
            console.log("Height :", newHeight);
            var m = { action: "loadTile", accessToken: accessToken, height: newHeight, width: parentDivWidth+200};
            var message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('iFrameEmbedTile');
            iframe.contentWindow.postMessage(message, "*");;


            
            var m = { action: "loadTile", accessToken: accessToken, height: newHeight, width: parentDivWidth + 200};
            var message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('weatherIFrame');
            iframe.contentWindow.postMessage(message, "*");;

           
        }
        
        $scope.country = '';

        $scope.meterSelection = function (e) {
            console.log(e);
            console.log(map);
            

        }

    });