'use strict';
var restServer = "http://powergridrestservice.azurewebsites.net/"
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
var restServer = "http://powergridrestservice.azurewebsites.net/";
//var restServer = "http://localhost:42299/"


//var embedURL = "https://app.powerbi.com/reportEmbed?reportId=a30a9243-68de-4d0e-a208-9dff2b3f0d61";
var embedURL = "https://app.powerbi.com/embed?dashboardId=8f6b24a3-51e0-45c4-b162-e9a318dfb866&tileId=562ea38f-fbb5-49d2-a683-742c5141b074";
var access_Token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlJyUXF1OXJ5ZEJWUldtY29jdVhVYjIwSEdSTSIsImtpZCI6IlJyUXF1OXJ5ZEJWUldtY29jdVhVYjIwSEdSTSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYzEzMTAzODYtNDI5Ny00YWY4LWEyYjEtNTI1NTRhZjBjM2RkLyIsImlhdCI6MTQ4MDkzOTYxNSwibmJmIjoxNDgwOTM5NjE1LCJleHAiOjE0ODA5NDM1MTUsImFjciI6IjEiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiZGU4OTAyZTQtNTIwNi00NTIyLWI5Y2QtZjQxNWFmMmQyZDhmIiwiYXBwaWRhY3IiOiIxIiwiZV9leHAiOjEwODAwLCJmYW1pbHlfbmFtZSI6IkFkbWluIiwiZ2l2ZW5fbmFtZSI6IklUIiwiaXBhZGRyIjoiMTE0LjE0My42Ljk4IiwibmFtZSI6IklUIEFkbWluIiwib2lkIjoiMWU4MWEzZjYtM2IxZC00N2I2LTlmZDktMjI0MzMyMGI1NjQ0IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDM3RkZFOTdBRUU5NjgiLCJzY3AiOiJEYXNoYm9hcmQuUmVhZC5BbGwgRGF0YXNldC5SZWFkLkFsbCBHcm91cC5SZWFkIFJlcG9ydC5SZWFkLkFsbCIsInN1YiI6IjdhNVV6bjVxb3p4ZDlLSVYzQ0IwN1VnNnlraEtoVjBQNGNlLTFOQVhVaU0iLCJ0aWQiOiJjMTMxMDM4Ni00Mjk3LTRhZjgtYTJiMS01MjU1NGFmMGMzZGQiLCJ1bmlxdWVfbmFtZSI6Iml0YWRtaW5AYWRtaW5kb21haW4ub25taWNyb3NvZnQuY29tIiwidXBuIjoiaXRhZG1pbkBhZG1pbmRvbWFpbi5vbm1pY3Jvc29mdC5jb20iLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCJdfQ.cZcYC4sK7BON_CIpFJFNR-JWRD3AfDTgWzcHpc4jl9QkRtpMGIfs5EGCVetcsdIgmQ5UI3OptlDIdNGAqINKogiXVWrAxJRfJ81SILw6HL9lL164I6phi51GdBkB_J9_q8XQMZQtR-9baPOabnN6antDsOY9mnl33gc9vQYl3VoMCHpbXDQ_Bg_b0C-9QkN6Q7hqHmolXPmCckro45z0RDc-z6AKCkduFvUMCBaQK947gvXKjjWrmzPpCzaiTHFU91o5cxccjWJ9U-u-mPVGKdGaH8HlDomRZoNWpE1xWiXXu_mNotB8u3AHMGiWl_CM7UA0vNNtsTn0NFl6Ln2ULw";

angular.module('WebPortal')
    .controller('overviewCtrl', function ($scope, $http, $location) {
    
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
        //document.getElementById("printoutPanel").innerHTML = args.target.MeterName + " selected";
        document.getElementById("meterName").innerHTML = args.target.MeterName;
        var pinLocation = args.target.getLocation();
        document.getElementById("latVal").innerHTML = "Latitude: " + pinLocation.latitude;
        document.getElementById("lonVal").innerHTML = "Longitude: " + pinLocation.longitude;
        document.getElementById("dailyConsumption").innerHTML = "Daily consumption: " + args.target.MeterDailyConsumption;
        document.getElementById("monthlyConsumption").innerHTML = "Monthly consumption: " + args.target.MeterMontlyConsumption;
        document.getElementById("meterDetails").style.display = "block";

        embedReport();
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
        var embedUrl = embedURL;
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
        accessToken = access_Token

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

 });