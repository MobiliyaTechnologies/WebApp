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




var tileEmbedURL = "https://app.powerbi.com/embed?dashboardId=cea6812f-9d03-4394-ae7b-cbdb779d9b6f&tileId=586f0945-d4ea-48fc-8ed5-2ba3f4aed68b";
var weatherTileURL = "https://app.powerbi.com/embed?dashboardId=cea6812f-9d03-4394-ae7b-cbdb779d9b6f&tileId=d6206311-42ff-4325-9192-1a181cf07536";

angular.module('WebPortal')
    .controller('overviewCtrl', function ($scope, $http, $location, Token, config) {

        $scope.loadMapScenario = function () {
            var mapLocation = new Microsoft.Maps.Location(40.571276, -105.085522);
            map = new Microsoft.Maps.Map(document.getElementById('myMap1'),
                {
                    credentials: 'Ahmc1XzhRQwnhx-_HvtFWJH5y1TOqNaUEOZgzPPHQyyffV8z-UyK3tfrkaEMZpiv',
                    center: mapLocation,
                    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                    zoom: 18
                });
            $http({
                url: config.restServer + "api/getmeters/",
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log(response);
                meterList = response;

                for (var i in meterList) {
                    console.log(meterList[i].Name);
                    createPushpin(meterList[i]);
                }

            })
                .error(function (error) {
                    alert("Error : " + JSON.stringify(error));
                });

        }

        function createPushpin(meter) {
            var location = new Microsoft.Maps.Location(meter.Latitude, meter.Longitude)
            var radius = 0;

            var fillColor = 'rgba(60,162,224, 0.7)';
            if (meter.Name == 'P371602077') {
                fillColor = 'rgba(138, 212, 235, 0.7)';
            }
            else if (meter.Name == 'P371602079') {
                fillColor = 'rgba(254, 150, 102, 0.7)';
            }
            else if (meter.Name == 'P371602073') {
                fillColor = 'rgba(242, 200, 15, 0.7)';
            }
            else if (meter.Name == 'P371602072') {
                fillColor = 'rgba(253, 98, 94, 0.7)';
            }
            else if (meter.Name == 'P371602070') {


            }
            else if (meter.Name == 'P371602075') {

                fillColor = 'rgba(95, 107, 109, 0.7)';
            }
            if (meter.MonthlyConsumption == 0) {
                radius = 0;
            }
            else if (meter.MonthlyConsumption > 0 && meter.MonthlyConsumption <= 1000) {
                if (meter.MonthlyConsumption < 500) {
                    //Minimum radius for the circle
                    radius = 10;
                }
                else {
                    radius = meter.MonthlyConsumption / 50;
                }
            }
            else if (meter.MonthlyConsumption > 1000 && meter.MonthlyConsumption <= 10000) {
                if (meter.MonthlyConsumption < 5250) {
                    //Minimum radius for the circle
                    radius = 21;
                }
                else {
                    radius = meter.MonthlyConsumption / 250;
                }
            }
            else if (meter.MonthlyConsumption > 10000 && meter.MonthlyConsumption <= 50000) {
                if (meter.MonthlyConsumption < 25625) {
                    //Minimum radius for the circle
                    radius = 41;
                }
                else {
                    radius = meter.MonthlyConsumption / 625;
                }
            }
            else {
                if (meter.MonthlyConsumption < 61000) {
                    //Minimum radius for the circle
                    radius = 61;
                }
                else {
                    radius = meter.MonthlyConsumption / 1000;
                }
            }
            var offset = new Microsoft.Maps.Point(0, 5); 
            var pushpin = new Microsoft.Maps.Pushpin(location, {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="5" fill="black" /></svg>',
                anchor: new Microsoft.Maps.Point(5, 5), text: meter.Name
            });

            var dailyConsumption = meter.DailyConsumption;
            dailyConsumption = Math.round(dailyConsumption * 100) / 100;

            var monthlyConsumption = meter.MonthlyConsumption;
            monthlyConsumption = Math.round(monthlyConsumption * 100) / 100;

            map.entities.push(pushpin);
            pushpin.MeterName = meter.Name;
            pushpin.MeterDailyConsumption = dailyConsumption;
            pushpin.MeterMontlyConsumption = monthlyConsumption;


            var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', ((radius + 5) * 2),
                '" height="', ((radius + 5) * 2), '"><circle cx="', (radius + 5), '" cy="', (radius + 5), '" r="', radius, '" fill="', fillColor, '"/></svg>'];

            var pushpin2 = new Microsoft.Maps.Pushpin(location, {
                icon: svg.join(''),
                anchor: new Microsoft.Maps.Point(radius, radius),
            });
            map.entities.push(pushpin2);
            pushpin2.MeterName = meter.Name;
            pushpin2.MeterDailyConsumption = dailyConsumption;
            pushpin2.MeterMontlyConsumption = monthlyConsumption;

            Microsoft.Maps.Events.addHandler(pushpin, 'click', onPushpinClicked);
            Microsoft.Maps.Events.addHandler(pushpin2, 'click', onPushpinClicked);

            Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', onPushpinMouseOver);
            Microsoft.Maps.Events.addHandler(pushpin, 'mouseout', onPushpinMouseOut);

            Microsoft.Maps.Events.addHandler(pushpin2, 'mouseover', onPushpinMouseOver);
            Microsoft.Maps.Events.addHandler(pushpin2, 'mouseout', onPushpinMouseOut);
        }

        function onPushpinClicked(args) {
            console.log(args.target);
            $scope.selectedMeterName = args.target.MeterName;
            document.getElementById("iFrameEmbedTile").style.display = 'none';
            document.getElementById("meterName").style.display = 'block';
            //document.getElementById("meterName").innerHTML = args.target.MeterName;
            //document.getElementById("dailyConsumption").innerHTML = "Daily consumption: " + args.target.MeterDailyConsumption;
            //document.getElementById("monthlyConsumption").innerHTML = "Monthly consumption: " + args.target.MeterMontlyConsumption;
            //document.getElementById("meterDetails").style.display = "block";


        }

        function onPushpinMouseOver(args) {
            infobox = new Microsoft.Maps.Infobox(args.target.getLocation(), {
                title: args.target.MeterName,
                description: 'Consumption: ' + args.target.MeterMontlyConsumption,
                visible: true,
                offset: new Microsoft.Maps.Point(5, 0)
            });
            infobox.setMap(map);
        }

        function onPushpinMouseOut(args) {
            infobox.setOptions({ visible: false });
        }

        //function embedReport() {
        //    var embedUrl = reportEmbedURL;
        //    if ("" === embedUrl) {
        //        console.log("No embed URL found");
        //        return;
        //    }


        //    // to load a report do the following:
        //    // 1: set the url
        //    // 2: add a onload handler to submit the auth token
        //    iframe = document.getElementById('iFrameEmbedReport');
        //    iframe.src = embedUrl;
        //    iframe.onload = postActionLoadReport;
        //};

        //function postActionLoadReport() {

        //    // get the access token.
        //    accessToken = Token.data.accesstoken
        //    console.log(accesstoken)
        //    // return if no a
        //    if ("" === accessToken) {
        //        console.log("Access token not found");
        //        return;
        //    }

        //    // construct the push message structure
        //    // this structure also supports setting the reportId, groupId, height, and width.
        //    // when using a report in a group, you must provide the groupId on the iFrame SRC
        //    var m = { action: "loadReport", accessToken: accessToken };
        //    message = JSON.stringify(m);

        //    // push the message.
        //    iframe = document.getElementById('iFrameEmbedReport');
        //    iframe.contentWindow.postMessage(message, "*");;
        //}

        var width = 300;
        var height = 180;

        function embedTile() {
            // check if the embed url was selected
            var embedTileUrl = tileEmbedURL;
            if ("" === embedTileUrl) {
                console.log("No embed URL found");
                return;
            }

            // to load a tile do the following:
            // 1: set the url, include size.
            // 2: add a onload handler to submit the auth token
            iframe = document.getElementById('iFrameEmbedTile');
            iframe.src = embedTileUrl + "&width=" + width + "&height=" + height;
            iframe.onload = postActionLoadTile;
        }


        // post the auth token to the iFrame. 
        function postActionLoadTile() {
            // get the access token.
            var accessToken = Token.data.accesstoken;
            console.log(accessToken)
            //accessToken = access_Token;

            // return if no a
            if ("" === accessToken) {
                console.log("Access token not found");
                return;
            }
            $scope.setIFrameSize();
            //var h = height;
            //var w = width;

            //// construct the push message structure
            //var m = { action: "loadTile", accessToken: accessToken, height: h, width: w };
            //var message = JSON.stringify(m);

            //// push the message.
            //iframe = document.getElementById('iFrameEmbedTile');
            //iframe.contentWindow.postMessage(message, "*");;
        }

        function embedWeatherTile() {
            var embedTileUrl = weatherTileURL;
            if ("" === embedTileUrl) {
                console.log("No embed URL found");
                return;
            }

            // to load a tile do the following:
            // 1: set the url, include size.
            // 2: add a onload handler to submit the auth token
            iframe = document.getElementById('weatherIFrame');
            iframe.src = embedTileUrl ;
            iframe.onload = postActionWeatherLoadTile;
        }

        function postActionWeatherLoadTile() {
            // get the access token.
            //accessToken = access_Token;
            var accessToken = Token.data.accesstoken;

            // return if no a
            if ("" === accessToken) {
                console.log("Access token not found");
                return;
            }
            $scope.setIFrameSize();
            var h = 180;
            var w = 300;

            // construct the push message structure
            var m = { action: "loadTile", accessToken: accessToken, height: h, width: w };
            var message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('weatherIFrame');
            iframe.contentWindow.postMessage(message, "*");;
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
            var ogHeight = 600;
            var ogRatio = ogWidth / ogHeight;
            console.log("setIframesize");
            var windowWidth = $(window).width();
            //if (windowWidth < 480) {
            var parentDivWidth = $(".iframe-class").parent().width();
            var newHeight = (parentDivWidth / ogRatio);
            $(".iframe-class").addClass("iframe-class-resize");
            $(".iframe-class-resize").css("width", parentDivWidth);
            $(".iframe-class-resize").css("height", newHeight);
            console.log(newHeight);
            console.log(parentDivWidth);
            var accessToken = Token.data.accesstoken;
            var m = { action: "loadTile", accessToken: accessToken, height: newHeight, width: parentDivWidth+100};
            var message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('iFrameEmbedTile');
            iframe.contentWindow.postMessage(message, "*");;

           
        }
    });