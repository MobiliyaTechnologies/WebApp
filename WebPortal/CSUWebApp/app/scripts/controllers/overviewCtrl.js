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
var restServer = "http://powergridrestservice.azurewebsites.net/";
//var restServer = "http://localhost:42299/"


var reportEmbedURL = "https://app.powerbi.com/reportEmbed?reportId=a30a9243-68de-4d0e-a208-9dff2b3f0d61";
var tileEmbedURL = "https://app.powerbi.com/embed?dashboardId=8f6b24a3-51e0-45c4-b162-e9a318dfb866&tileId=562ea38f-fbb5-49d2-a683-742c5141b074";
var weatherTileURL = "https://app.powerbi.com/embed?dashboardId=cea6812f-9d03-4394-ae7b-cbdb779d9b6f&tileId=2c0f4146-6b11-4a7f-8af0-96b6ccb1d391";

angular.module('WebPortal')
    .controller('overviewCtrl', function ($scope, $http, $location,Token) {
        $scope.loadMapScenario = function () {
            console.log("Hiii");
            $http({
                url: restServer + "api/getmeters/",
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log(response);
                meterList = response;
                var mapLocation = new Microsoft.Maps.Location(meterList[0].Latitude, meterList[0].Longitude);
                map = new Microsoft.Maps.Map(document.getElementById('myMap1'),
                   {
                       credentials: 'Ahmc1XzhRQwnhx-_HvtFWJH5y1TOqNaUEOZgzPPHQyyffV8z-UyK3tfrkaEMZpiv',
                       center: mapLocation,
                       mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                       zoom: 18
                   });
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
            var fillColor = 'rgba(255, 94, 45, 0.4)';

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

            var pushpin = new Microsoft.Maps.Pushpin(location, {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="5" fill="black" /></svg>',
                anchor: new Microsoft.Maps.Point(5, 5)
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
            //document.getElementById("meterName").innerHTML = args.target.MeterName;
            //document.getElementById("dailyConsumption").innerHTML = "Daily consumption: " + args.target.MeterDailyConsumption;
            //document.getElementById("monthlyConsumption").innerHTML = "Monthly consumption: " + args.target.MeterMontlyConsumption;
            //document.getElementById("meterDetails").style.display = "block";

            embedTile();
            embedWeatherTile();
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

        function embedReport() {
            var embedUrl = reportEmbedURL;
            if ("" === embedUrl) {
                console.log("No embed URL found");
                return;
            }


            // to load a report do the following:
            // 1: set the url
            // 2: add a onload handler to submit the auth token
            iframe = document.getElementById('iFrameEmbedReport');
            iframe.src = embedUrl;
            iframe.onload = postActionLoadReport;
        };

        function postActionLoadReport() {

            // get the access token.
            accessToken = Token.data.accesstoken

            // return if no a
            if ("" === accessToken) {
                console.log("Access token not found");
                return;
            }

            // construct the push message structure
            // this structure also supports setting the reportId, groupId, height, and width.
            // when using a report in a group, you must provide the groupId on the iFrame SRC
            var m = { action: "loadReport", accessToken: accessToken };
            message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('iFrameEmbedReport');
            iframe.contentWindow.postMessage(message, "*");;
        }

        var width = 500;
        var height = 500;

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
            //accessToken = access_Token;

            // return if no a
            if ("" === accessToken) {
                console.log("Access token not found");
                return;
            }

            var h = height;
            var w = width;

            // construct the push message structure
            var m = { action: "loadTile", accessToken: accessToken, height: h, width: w };
            var message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('iFrameEmbedTile');
            iframe.contentWindow.postMessage(message, "*");;
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
            iframe.src = embedTileUrl + "&width=" + 500 + "&height=" + 300;
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

            var h = 300;
            var w = 500;

            // construct the push message structure
            var m = { action: "loadTile", accessToken: accessToken, height: h, width: w };
            var message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('weatherIFrame');
            iframe.contentWindow.postMessage(message, "*");;
        }

    });