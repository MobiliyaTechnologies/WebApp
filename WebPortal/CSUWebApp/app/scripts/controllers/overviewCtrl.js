'use strict';
/**
 * @ngdoc function
 * @name angulartestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angulartestApp
 */
var map,buldingMap;
var count = 0;
var meterList;
var infobox;
var iframe;
var tileEmbedURL = "https://app.powerbi.com/embed?dashboardId=09821193-5c76-4a55-b960-74815806ecac&tileId=37167b28-d3ec-4d9e-b937-405f0b96bb87";
var donutTileURL = "https://app.powerbi.com/embed?dashboardId=09821193-5c76-4a55-b960-74815806ecac&tileId=baecd6f4-7ff1-4aea-a882-fdb1dea1f885";
var colors = ['rgba(60,162,224, 0.7)', 'rgba(138, 212, 235, 0.7)', 'rgba(254, 150, 102, 0.7)', 'rgba(95, 107, 109, 0.7)','rgba(253, 98, 94, 0.7)']
var powerBIUrls = {
    "campus": {
        "generic": "https://app.powerbi.com/reportEmbed?reportId=2d099277-61b5-4143-9c35-46d4bd6afd1e&$filter=Campus/CampusName eq",
        "monthly_consumption": "https://app.powerbi.com/reportEmbed?reportId=c876d93f-08fc-4705-953f-fa2626714d19&$filter=Campus/CampusName eq",
        "weekly_consumption": "https://app.powerbi.com/reportEmbed?reportId=093af6bc-60a6-431e-b18e-2649b4b8a718&$filter=Campus/CampusName eq",
        "day_wise_current_month": "https://app.powerbi.com/reportEmbed?reportId=008d3b57-d78c-44c1-9777-c385acdf2419&$filter=Campus/CampusName eq ",
        "current_month_prediction": "https://app.powerbi.com/reportEmbed?reportId=01a810d5-576e-4117-b357-8986a9faf5c3&$filter=Campus/CampusName eq 'CSU Campus 2’",
    },
    "building": {
        "generic": "https://app.powerbi.com/reportEmbed?reportId=5c976c7e-8aed-4746-93fc-2cd8bd6daa64&$filter=BridgeCampusBuilding/CampusBuilding eq ",
        "monthly_consumption": "https://app.powerbi.com/reportEmbed?reportId=fc6b9c08-df72-4ac5-9dca-068b17fc7861&$filter=BridgeCampusBuilding/CampusBuilding eq ",
        "weekly_consumption": "https://app.powerbi.com/reportEmbed?reportId=54536e66-3fa7-477c-b9b9-0b69015458b4&$filter=BridgeCampusBuilding/CampusBuilding eq ",
        "day_wise_current_month": "https://app.powerbi.com/reportEmbed?reportId=d3a07bf7-9f61-4d4c-ad80-7d700c5eaf70&$filter=BridgeCampusBuilding/CampusBuilding eq ",
        "current_month_prediction": "https://app.powerbi.com/reportEmbed?reportId=01a810d5-576e-4117-b357-8986a9faf5c3&$filter=BridgeCampusBuilding/CampusBuilding eq ",
    }
}

angular.module('WebPortal')
    .controller('overviewCtrl', function ($scope, $http, $location, Token, config, $timeout, Restservice ) {
        $scope.userId = localStorage.getItem("userId");
        $scope.campusList = [];
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
           
            getCampusList();
        }
        /**
        * Function to get all Building associated with campus
        */
        function getBuildingList(campusId) {
            Restservice.get('api/GetBuildingsByCampus/' + campusId, function (err, response) {
                if (!err) {
                    console.log("Get BuildingsBy Campus :: [Info]", response);
                    createBasePushPin('building', response);
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
                    createBasePushPin('campus',$scope.campusList);
                    createColorPushPin('campus', $scope.campusList);
                    
                }
                else {
                    console.log(err);
                }
            });
        }
        $scope.loadCampus = function () {
            map.entities.clear();
            $scope.back_button = false;
            createBasePushPin('campus', $scope.campusList);
            createColorPushPin('campus', $scope.campusList);
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
                if(type=='campus'){
                    pushpin.Name = entityList[i].CampusName;
                    pushpin.ID = entityList[i].CampusID;
                    pushpin.Type = 'campus';
                }
                else if (type == 'building') {
                    pushpin.Name = entityList[i].CampusName;
                    pushpin.ID = entityList[i].CampusID;
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
                    anchor: new Microsoft.Maps.Point(radius, radius), text: entityList[i].CampusName, textOffset: new Microsoft.Maps.Point(0, 10)

                });
                
                map.entities.push(pushpin2);
                if (type == 'campus') {
                    pushpin2.Name = entityList[i].CampusName;
                    pushpin2.ID = entityList[i].CampusID;
                    pushpin2.Type = 'campus';
                }
                else if (type == 'building') {
                    pushpin2.Name = entityList[i].CampusName;
                    pushpin2.ID = entityList[i].CampusID;
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
            if (args.target.Type == 'campus') {
                map.entities.clear();
                $scope.back_button = true;
                getBuildingList(args.target.ID);
                embedReport(powerBIUrls.campus.generic + "\'" + args.target.Name + "\'", 'reports');
                embedReport(powerBIUrls.campus.monthly_consumption + "\'" + args.target.Name + "\'", 'monthly_consumption_report');
                embedReport(powerBIUrls.campus.weekly_consumption + "\'" + args.target.Name + "\'", 'weekly_consumption_report');
                embedReport(powerBIUrls.campus.day_wise_current_month + "\'" + args.target.Name + "\'", 'day_wise_current_month_report');
                embedReport(powerBIUrls.campus.current_month_prediction + "\'" + args.target.Name + "\'", 'current_month_prediction_report');
            }
            else {
                args.target.Name = 'CSU Campus 2Chemistry Building';
                embedReport(powerBIUrls.building.generic + "\'" + args.target.Name + "\'", 'reports');
                embedReport(powerBIUrls.building.monthly_consumption + "\'" + args.target.Name + "\'", 'monthly_consumption_report');
                embedReport(powerBIUrls.building.weekly_consumption + "\'" + args.target.Name + "\'", 'weekly_consumption_report');
                embedReport(powerBIUrls.building.day_wise_current_month + "\'" + args.target.Name + "\'", 'day_wise_current_month_report');
                embedReport(powerBIUrls.building.current_month_prediction + "\'" + args.target.Name + "\'", 'current_month_prediction_report');
            }
        }

        function embedReport(reportURL,iframeId) {          
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


        function getInsight() {
            Restservice.get('api/GetInsightData', function (err, response) {
                if (!err) {
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
                    console.log(err);
                }
                $scope.$apply();

            });
        }
        getInsight();
        function getRecommendation() {
           

            Restservice.get('api/getrecommendations/', function (err, response) {
                if (!err) {
                    $scope.recommendations = response;
                }
                else {
                    console.log(err);
                }
                $scope.$apply();

            });
        }
        getRecommendation();
        //function getMeterList() {
        //    $http({
        //        url: config.restServer + "api/getmeterlist/" + $scope.userId,
        //        dataType: 'json',
        //        method: 'Get',
        //    }).success(function (response) {
        //        console.log("Get Meter List [Info] ::", response);
        //        $scope.meterList = response;
        //        $scope.options = {
        //            dataTextField: 'Name',
        //            dataSource: $scope.meterList
        //        }
        //        getMonthlyConsumption();
        //        getUrls(0);
        //        for (var i in $scope.meterList) {
        //            createBasePushPin($scope.meterList[i]);
        //        }

        //    })
        //    .error(function (error) {
        //            console.log("Error : " + JSON.stringify(error));
        //    });
        //}
        ///**
        // * 
        // * @param index
        // */
        //function getUrls(index) {
        //    if (index < $scope.meterList.length) {
        //        $http({
        //            url: config.restServer + "api/getpowerbiurl/" + $scope.userId + '/' + $scope.meterList[index].Serial,
        //            dataType: 'json',
        //            method: 'Get',
        //        }).success(function (response) {
        //            //console.log("Get Meter Urls of " + $scope.meterList[index].Serial + "::", response);
        //            response.Serial = $scope.meterList[index].Serial;
        //            response.Name = $scope.meterList[index].Name;
        //            $scope.urls.push(response);
        //            getUrls(index + 1);
        //        })
        //        .error(function (error) {
        //                // alert("Error : " + JSON.stringify(error));
        //            console.log("Error :", JSON.stringify(error));
        //        });
        //    }
        //    else {
        //        console.log("Get Meter Urls [Info] ::",$scope.urls);
        //    }
        //}
        ///**
        // * 
        // */
        //function getMonthlyConsumption() {
        //    $http({
        //        url: config.restServer + "api/getmonthlyconsumption/" + $scope.userId,
        //        dataType: 'json',
        //        method: 'Get',
        //    }).success(function (response) {
        //        console.log("Get Monthly Consumption [Info] ::", response);
        //        $scope.MonthlyConsumption = response;
        //        for (var j = 0; j < $scope.meterList.length;j++) {
        //           // console.log("$scope.meterList", $scope.meterList[j]);
        //            var index = $scope.MonthlyConsumption.findIndex(function (item, i) {
        //                return item.Powerscout == $scope.meterList[j].Serial;
        //            });
        //            if (index >=0) {
        //                $scope.MonthlyConsumption[index].Latitude = $scope.meterList[j].Latitude;
        //                $scope.MonthlyConsumption[index].Longitude = $scope.meterList[j].Longitude;
        //                $scope.MonthlyConsumption[index].Name = $scope.meterList[j].Name;
        //                createColorPushPin($scope.MonthlyConsumption[index]);
                        
        //            }
        //        }
        //    })
        //    .error(function (error) {
        //            console.log("Error : " + JSON.stringify(error));
        //    });
        //}
        /**
         * 
         * @param meter
         */
        //function createBasePushPin(meter) {
        //    var location = new Microsoft.Maps.Location(meter.Latitude, meter.Longitude);
        //    var pushpin = new Microsoft.Maps.Pushpin(location, {
        //        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="5" fill="black" /></svg>',
        //        anchor: new Microsoft.Maps.Point(5, 5)
        //    });
        //    map.entities.push(pushpin);
        //    pushpin.MeterName = meter.Name;
        //    Microsoft.Maps.Events.addHandler(pushpin, 'click', onPushpinClicked);
        //    Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', onPushpinMouseOver);
        //    Microsoft.Maps.Events.addHandler(pushpin, 'mouseout', onPushpinMouseOut);
        //}
        ///**
        // * 
        // * @param meter
        // */
        //function createColorPushPin(meter) {
            
        //    var location = new Microsoft.Maps.Location(meter.Latitude, meter.Longitude);
        //    var radius = 15;
        //    var fillColor = 'rgba(60,162,224, 0.7)';
        //    if (meter.Powerscout == 'P371602077') {
        //        fillColor = 'rgba(138, 212, 235, 0.7)';
        //    }
        //    else if (meter.Powerscout == 'P371602079') {
        //        fillColor = 'rgba(254, 150, 102, 0.7)';
        //    }
        //    else if (meter.Powerscout == 'P371602073') {
        //        fillColor = 'rgba(242, 200, 15, 0.7)';
        //    }
        //    else if (meter.Powerscout == 'P371602072') {
        //        fillColor = 'rgba(253, 98, 94, 0.7)';
        //    }
        //    else if (meter.Powerscout == 'P371602070') {

        //    }
        //    else if (meter.Powerscout == 'P371602075') {
        //        fillColor = 'rgba(95, 107, 109, 0.7)';
        //    }
        //    if (meter.Monthly_KWH_Consumption == 0) {
        //        radius = 25;
        //    }
        //    else if (meter.Monthly_KWH_Consumption > 0 && meter.Monthly_KWH_Consumption <= 1000) {
        //        if (meter.Monthly_KWH_Consumption < 500) {
        //            radius = 10;
        //        }
        //        else {
        //            radius = meter.Monthly_KWH_Consumption / 50;
        //        }
        //    }
        //    else if (meter.Monthly_KWH_Consumption > 1000 && meter.Monthly_KWH_Consumption <= 10000) {
        //        if (meter.Monthly_KWH_Consumption < 5250) {
        //            //Minimum radius for the circle
        //            radius = 21;
        //        }
        //        else {
        //            radius = meter.Monthly_KWH_Consumption / 250;
        //        }
        //    }
        //    else if (meter.Monthly_KWH_Consumption > 10000 && meter.Monthly_KWH_Consumption <= 50000) {
        //        if (meter.Monthly_KWH_Consumption < 25625) {
        //            //Minimum radius for the circle
        //            radius = 41;
        //        }
        //        else {
        //            radius = meter.Monthly_KWH_Consumption / 625;
        //        }
        //    }
        //    else {
        //        if (meter.Monthly_KWH_Consumption < 61000) {
        //            //Minimum radius for the circle
        //            radius = 61;
        //        }
        //        else {
        //            radius = meter.Monthly_KWH_Consumption / 1000;
        //        }
        //    }
            
        //    var offset = new Microsoft.Maps.Point(0, 5);
        //    var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', ((radius + 5) * 2),
        //        '" height="', ((radius + 5) * 2), '"><circle cx="', (radius + 5), '" cy="', (radius + 5), '" r="', radius, '" fill="', fillColor, '"/></svg>'];
        //    var mname = meter.Name.substring(0, 10)+'..';
        //    var pushpin2 = new Microsoft.Maps.Pushpin(location, {
        //        icon: svg.join(''),
        //        anchor: new Microsoft.Maps.Point(radius, radius), text: mname, textOffset: new Microsoft.Maps.Point(0, 10)

        //    });
        //    pushpin2.MeterSerial = meter.Powerscout;
        //    pushpin2.MeterName = meter.Name;
        //    pushpin2.Monthly_Electric_Cost = meter.Monthly_electric_Cost;
        //    pushpin2.Monthly_KWH_Consumption = meter.Monthly_KWH_Consumption;
        //    map.entities.push(pushpin2);
        //    Microsoft.Maps.Events.addHandler(pushpin2, 'click', onPushpinClicked);
        //    Microsoft.Maps.Events.addHandler(pushpin2, 'mouseover', onPushpinMouseOver);
        //    Microsoft.Maps.Events.addHandler(pushpin2, 'mouseout', onPushpinMouseOut);
        //}
        ///**
        // * 
        // * @param args
        // */
        //function onPushpinClicked(args) {
            
        //    var index = $scope.urls.findIndex(function (item, i) {
        //        return item.Serial == args.target.MeterSerial;
        //    });
        //    $scope.MeterName = args.target.MeterName;
            
        //    if (index >= 0) {
        //        if ($scope.urls[index].Report != undefined) {
        //            embedReport($scope.urls[index].Report);
        //            changeLayout($scope.MeterName);
        //            $scope.$apply();
        //            $("#scrolldiv").animate({
        //                scrollTop: $("#report").offset().top
        //            });
        //        }
        //    }

        
        function onSeriesClicked(meter) {
            
            var index = $scope.urls.findIndex(function (item, i) {
                return item.Name == meter;
            });
            $scope.MeterName = meter.Name;
            if (index > 0) {
                if ($scope.urls[index].Report != undefined) {
                    embedReport($scope.urls[index].Report);
                    $scope.$apply();
                    $("#scrolldiv").animate({
                        scrollTop: $("#layout").offset().top+400
                    });
                }
            }

        }
        /**
         * 
         * @param args
         */
        function onPushpinMouseOver(args) {
            infobox = new Microsoft.Maps.Infobox(args.target.getLocation(), {
                title: args.target.MeterName,
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

        /**
         * 
         */
        function embedTile() {
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
            iframe.src = embedTileUrl;
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
            var ogWidth = 1200;
            var ogHeight = 900;
            var ogRatio = ogWidth / ogHeight;
            var windowWidth = $(window).width();
            //if (windowWidth < 480) {
            var parentDivWidth = $(".iframe-class-overview-page").parent().width();
            var newHeight = (parentDivWidth / ogRatio);
            $(".iframe-class-overview-page").addClass("iframe-class-resize");
            $(".iframe-class-resize").css("width", parentDivWidth);
            $(".iframe-class-resize").css("height", newHeight);
            var accessToken = Token.data.accesstoken;
            var m = { action: "loadTile", accessToken: accessToken, height: newHeight, width: parentDivWidth };
            var message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('iFrameEmbedTile');
            iframe.contentWindow.postMessage(message, "*");;



            var m = { action: "loadTile", accessToken: accessToken, height: newHeight, width: parentDivWidth };
            var message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('weatherIFrame');
            iframe.contentWindow.postMessage(message, "*");;


        }

        $scope.country = '';

        $scope.meterSelection = function (e) {
           
            //map.center = center;
            map.setView({
                center: new Microsoft.Maps.Location(e.dataItem.Latitude, e.dataItem.Longitude),
                zoom: 18,
                animate: true,
                mapTypeId: Microsoft.Maps.MapTypeId.road
                   

            });

            //map.setView(new Microsoft.Maps.Location(e.dataItem.Latitude, e.dataItem.Longitude), 18, { animation: true });
            //map.setView(new Microsoft.Maps.Location(e.dataItem.Latitude, e.dataItem.Longitude), map.getZoom(), {
            //    "animate": true,
            //    "pan": {
            //        "duration": 10
            //    }
            //});
        }
        function changeLayout(meterName) {
            console.log("MeterName ::", meterName);
        }
        //function embedReport(reportURL) {
        //    var embedUrl = reportURL;
        //    if ("" === embedUrl) {
        //        console.log("No embed URL found");
        //        return;
        //    }
        //    iframe = document.getElementById('reportIframe');
        //    iframe.src = embedUrl;
        //    iframe.onload = postActionLoadReport;
        //};

        //function postActionLoadReport() {
        //    var accessToken = Token.data.accesstoken
        //    if ("" === accessToken) {
        //        console.log("Access token not found");
        //        return;
        //    }
        //    var m = { action: "loadReport", accessToken: accessToken };
        //    var message = JSON.stringify(m);
        //    iframe = document.getElementById('reportIframe');
        //    iframe.contentWindow.postMessage(message, "*");;
        //}


        
        //$scope.nextMonth = {
        //    chart: {
        //        type: 'line',
        //        events: {
        //            load: function (event) {

                       
        //            }
        //        }
        //    },
        //    title: {
        //        text: 'Next Month'
        //    },
        //    xAxis: {
        //        categories: ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        //    },
        //    plotOptions: {
        //        series: {
        //            cursor: 'pointer',
        //            point: {
        //                events: {
        //                    click: function () {
        //                        alert('Category: ' + this.category + ', value: ' + this.y);
        //                    }
        //                }
        //            }
        //        }
        //    },
        //    series: [{
        //        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        //    }]


        //};
        //var dt = new Date();
        //$scope.years = [2016, 2017];
        ////$scope.months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        //var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        //$scope.selectedYear = dt.getFullYear();
        //$scope.selectedMonth = months[dt.getMonth()];
        //console.log($scope.selectedMonth);
        //$scope.selectedMonthNo = months.indexOf($scope.selectedMonth);
        //$scope.changeYear = function () {
        //    console.log($scope.selectedYear);
        //    $scope.YearlyConsumption.series = [];
        //    $scope.YearlyConsumption.loading = true;       
        //    $scope.YearlyConsumption.title.text='Total Electricity consumption (' + $scope.selectedYear + ')';   
        //    getYearlyConsumption();

        //    $scope.WeeklyConsumption.series = [];
        //    $scope.WeeklyConsumption.loading = true;
        //    $scope.WeeklyConsumption.title.text = 'Weekly Electricity consumption (' + $scope.selectedYear + ')';
        //    $scope.currentMonth.series = [];
        //    $scope.currentMonth.loading = true;
        //    $scope.currentMonthPrediction.series = [];
        //    $scope.currentMonthPrediction.loading = true;
        //    $scope.nextMonthPrediction.series = [];
        //    $scope.nextMonthPrediction.loading = true;
        //    getWeeklyConsumption();
        //    getCurrentMonthConsumption();
        //    getNextMonthprediction();
        //    getCurrentMonthprediction();
        //}
        //$scope.changeMonth = function () {
        //    console.log($scope.selectedMonth);
        //    $scope.WeeklyConsumption.series = [];
        //    $scope.WeeklyConsumption.loading = true;
        //    $scope.WeeklyConsumption.title.text = 'Weekly Electricity consumption (' + $scope.selectedYear + ')';
        //    $scope.currentMonth.series = [];
        //    $scope.currentMonth.loading = true;
        //    $scope.nextMonth.series = [];
        //    $scope.nextMonth.loading = true;
        //    $scope.currentMonthPrediction.series = [];
        //    $scope.currentMonthPrediction.loading = true;
        //    $scope.nextMonthPrediction.series = [];
        //    $scope.nextMonthPrediction.loading = true;
        //    getWeeklyConsumption();
        //    getCurrentMonthConsumption();
        //    getNextMonthprediction();
        //    getCurrentMonthprediction();
        //}
        //$scope.moveMonthBackward = function () {
        //    $scope.selectedMonthNo = ($scope.selectedMonthNo - 1) % 12;
        //    if ($scope.selectedMonthNo < 0) {
        //        $scope.selectedMonthNo = 11;
        //        $scope.selectedYear--;
        //    }
        //    $scope.YearlyConsumption.title.text = 'Total Electricity consumption (' + $scope.selectedYear + ')'; 
        //    $scope.selectedMonth = months[$scope.selectedMonthNo];
        //    $scope.YearlyConsumption.loading = true; 
        //    $scope.YearlyConsumption.series = [];
        //    $scope.YearlyConsumption.xAxis.categories = [];
        //    getYearlyConsumption();
        //}
        //$scope.moveMonthForward = function () {
        //    $scope.selectedMonthNo = ($scope.selectedMonthNo + 1) % 12;
        //    if ($scope.selectedMonthNo ==0) {
        //        $scope.selectedYear++;
        //    }
        //    $scope.YearlyConsumption.title.text = 'Total Electricity consumption (' + $scope.selectedYear + ')'; 
        //    $scope.selectedMonth = months[$scope.selectedMonthNo];
        //    $scope.YearlyConsumption.loading = true; 
        //    $scope.YearlyConsumption.series = [];
        //    $scope.YearlyConsumption.xAxis.categories = [];
        //    getYearlyConsumption();

        //}
        //function getYearlyConsumption() {
             
              
        //    $http({
        //        url: config.restServer + "api/getmonthwiseconsumptionforoffset/" + $scope.userId + "/" + $scope.selectedMonth+"/"+$scope.selectedYear+"/12",
        //        dataType: 'json',
        //        method: 'Get',
        //    }).success(function (response) {
        //        console.log("Get Month Wise(Yearly) Consumption [Info] ::", response);
        //        $scope.YearlyConsumption.loading = false;   
        //        $scope.YearlyConsumption.series = [];
        //        for (var i = 0; i < months.length; i++) {
        //           $scope.YearlyConsumption.xAxis.categories.push(months[(i + $scope.selectedMonthNo+1) % months.length]);
        //        }    
        //        for (var i = 0; i < response.length; i++) {
        //            var data = [];
        //            for (var j = 0; j < months.length; j++) {
        //                data.push(response[i].MonthWiseConsumption[months[(j+$scope.selectedMonthNo + 1) % months.length]])
        //            }                      
        //            $scope.YearlyConsumptionChart.reflow();
        //            $scope.YearlyConsumption.series.push({
        //                id: response[i].PowerScout,
        //                stack: 'meter',
        //                data: data,
        //                name: response[i].Name,
        //                serial: response[i].PowerScout,
        //            });

        //        }

        //    })
        //    .error(function (error) {       
        //       console.log("Error : " + JSON.stringify(error));
        //    });
          
        //}
        //getYearlyConsumption();
        //$scope.YearlyConsumption = {
        //    chart: {
        //        type: 'column',

        //        events: {
        //            drilldown: function (e) {
        //                console.log(e.point); // The point, with name, that was clicked
        //            },
        //            load: function (event) {
        //                $scope.YearlyConsumptionChart = this;
        //            }
        //        },

        //        lang: {
        //            loading: 'Loading...'
        //        }


        //    },
        //    title: {
        //        text: 'Total Electricity consumption (' + $scope.selectedYear + ')'
        //    },

        //    xAxis: {
        //        categories:[]// ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        //    },

        //    yAxis: {
        //        allowDecimals: false,
        //        min: 0,
        //        title: {
        //            text: 'Total Consumption'
        //        }
        //    },

        //    tooltip: {
        //        formatter: function () {
        //            return '<b>' + this.x + '</b><br/>' +
        //                this.series.name + ': ' + this.y + '<br/>' +
        //                'Total Consumptiom: ' + this.point.stackTotal;
        //        }
        //    },

        //    plotOptions: {
        //        column: {
        //            stacking: 'normal'
        //        },
        //        series: {
        //            cursor: 'pointer',
        //            point: {
        //                events: {
        //                    click: function () {
        //                        console.log(this.series.name);
        //                        //alert('Category: ' + this.category + ', value: ' + this.y);
        //                        onSeriesClicked(this.series.name);
        //                    }
        //                }
        //            }
        //        }
        //    },

        //    series: [


        //    ],
        //    loading: true,
        //    credits: {
        //        enabled: false
        //    },

        //};
        //$scope.moveWeekBackward = function () {
        //    $scope.selectedMonthNo = ($scope.selectedMonthNo - 1) % 12;
        //    if ($scope.selectedMonthNo < 0) {
        //        $scope.selectedMonthNo = 11;
        //        $scope.selectedYear--;
        //    }
        //    $scope.selectedMonth = months[$scope.selectedMonthNo];
        //    $scope.WeeklyConsumption.series = [];
        //    $scope.WeeklyConsumption.loading = true;
        //    getWeeklyConsumption();

        //}
        //$scope.moveWeekForward = function () {
        //    $scope.selectedMonthNo = ($scope.selectedMonthNo + 1) % 12;
        //    if ($scope.selectedMonthNo == 0) {
        //        $scope.selectedYear++;
        //    }
        //    $scope.selectedMonth = months[$scope.selectedMonthNo];
        //    $scope.WeeklyConsumption.series = [];
        //    $scope.WeeklyConsumption.loading = true;           
        //    getWeeklyConsumption();


        //}
        //function getWeeklyConsumption() {
        //    var month = months[($scope.selectedMonthNo  ) % 12];

        //    var year = $scope.selectedYear;
        //    if (month == 'Jan')
        //        year = $scope.selectedYear + 1;
            
        //    $http({
        //         url: config.restServer + "api/getweekwisemonthlyconsumptionforoffset/" + $scope.userId + "/" + month + "/" + year+"/4",
        //        dataType: 'json',
        //        method: 'Get',
        //    }).success(function (response) {
        //        console.log("Get Weekly Consumption [Info] ::", response);
        //        $scope.WeeklyConsumption.title.text = 'Weekly Electricity consumption (' + $scope.selectedMonth + '/' + $scope.selectedYear + ')';
        //        $scope.WeeklyConsumption.loading = false;
        //        $scope.WeeklyConsumption.series = [];
        //        for (var i = 0; i < response.length; i++) {
        //            var data = [];
        //            for (var j = 0; j < response[i].WeekWiseConsumption.length; j++) {
        //                data.push(response[i].WeekWiseConsumption[j]);
        //            }
                    
        //            $scope.WeeklyConsumption.chart.title = 'Weekly Electricity consumption (' + $scope.selectedMonth + ')';
        //            $scope.WeeklyConsumption.series.push({
        //                id: response[i].PowerScout,
        //                stack: 'meter',
        //                data: data,
        //                name: response[i].Name,
        //                serial: response[i].PowerScout,
        //            });
        //            $scope.WeeklyConsumptionChart.reflow();
        //        }

        //    })
        //   .error(function (error) {
        //            console.log("Error : " + JSON.stringify(error));
        //    });
        //};
        //getWeeklyConsumption();
        //$scope.WeeklyConsumption = {
        //    chart: {
        //        type: 'column',

        //        events: {
        //            drilldown: function (e) {
        //                console.log(e.point); // The point, with name, that was clicked
        //            },
        //            load: function (event) {
        //                $scope.WeeklyConsumptionChart = this;
        //            }
        //        },

        //        lang: {
        //            loading: 'Loading...'
        //        }


        //    },
        //    title: {
        //        text: 'Weekly Electricity consumption (' + $scope.selectedMonth + ')'
        //    },

        //    xAxis: {
        //        categories: ['Week1', 'Week2', 'Week3', 'Week4', 'Week5','Week6']
        //    },

        //    yAxis: {
        //        allowDecimals: false,
        //        min: 0,
        //        title: {
        //            text: 'Total Consumption'
        //        }
        //    },

        //    tooltip: {
        //        formatter: function () {
        //            return '<b>' + this.x + '</b><br/>' +
        //                this.series.name + ': ' + this.y + '<br/>' +
        //                'Total Consumptiom: ' + this.point.stackTotal;
        //        }
        //    },

        //    plotOptions: {
        //        column: {
        //            stacking: 'normal'
        //        },
        //        series: {
        //            cursor: 'pointer',
        //            point: {
        //                events: {
        //                    click: function () {
        //                        console.log(this.series.name);
        //                        //alert('Category: ' + this.category + ', value: ' + this.y);
        //                        onSeriesClicked(this.series.name);
        //                    }
        //                }
        //            }
        //        }
        //    },

        //    series: [


        //    ],
        //    loading: true,
        //    credits: {
        //        enabled: false
        //    },

        //};

   

        //function getCurrentMonthConsumption() {
        //    $http({
        //        url: config.restServer + "api/getdaywisemonthlyconsumption/" + $scope.userId + "/" + $scope.selectedMonth + "/"+ $scope.selectedYear,
        //        dataType: 'json',
        //        method: 'Get',
        //    }).success(function (response) {
        //        console.log("Get CurrentMonthConsumption [Info] ::", response);
        //        console.log("METER LIST", $scope.meterList);
        //        for (var i = 0; i < response.length; i++) {
        //            if (response[i].DayWiseConsumption != undefined) {
        //                $scope.currentMonth.series.push({

        //                    data: response[i].DayWiseConsumption,
        //                    name: response[i].Name,

        //                });
        //            }
        //        }

        //    })
        //        .error(function (error) {
        //            console.log("Error : " + JSON.stringify(error));
        //        });
        //}
        //getCurrentMonthConsumption();



        //function getNextMonthprediction() {
        //    $http({
        //        url: config.restServer + "api/getdaywisenextmonthprediction/" + $scope.userId + "/" + $scope.selectedMonth +"/"+ $scope.selectedYear,
        //        dataType: 'json',
        //        method: 'Get',
        //    }).success(function (response) {
        //        console.log("Get NextMonthPrediction [Info] ::", response);

        //        for (var i = 0; i < response.length; i++) {

        //            if (response[i].DayWiseConsumptionPrediction != undefined) {
        //                $scope.nextMonthPrediction.series.push({

        //                    data: response[i].DayWiseConsumptionPrediction,
        //                    name: response[i].Name,

        //                });
        //            }
        //        }


        //    })
        //        .error(function (error) {
        //            console.log("Error : " + JSON.stringify(error));
        //        });
        //}
        //getNextMonthprediction();

        //function getCurrentMonthprediction() {
        //    $http({
        //        url: config.restServer + "api/getdaywisecurrentmonthprediction/" + $scope.userId + "/" + $scope.selectedMonth + "/" + $scope.selectedYear,
        //        dataType: 'json',
        //        method: 'Get',
        //    }).success(function (response) {
        //        console.log("Get CurrentMonthPrediction [Info] ::", response);

        //        for (var i = 0; i < response.length; i++) {

        //            if (response[i].DayWiseConsumptionPrediction != undefined) {
        //                $scope.currentMonthPrediction.series.push({
        //                    data: response[i].DayWiseConsumptionPrediction,
        //                    name: response[i].Name,

        //                });
        //            }
        //        }


        //    })
        //        .error(function (error) {
        //            console.log("Error : " + JSON.stringify(error));
        //        });
        //}
        //getCurrentMonthprediction();


        //// Sample options for first chart
        //$scope.currentMonth = {
        //    chart: {
        //        type: 'line',
        //        events: {
        //            load: function (event) {


        //            }
        //        }
        //    },
        //    title: {
        //        text: 'Day Wise Current Month Consumption'
        //    },
        //    xAxis: {
        //        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
        //    },
        //    plotOptions: {
        //        series: {
        //            cursor: 'pointer',
        //            point: {
        //                events: {
        //                    click: function () {
        //                        alert('Category: ' + this.category + ', value: ' + this.y);
        //                    }
        //                }
        //            }
        //        }
        //    },
        //    series: [],
        //    credits: {
        //        enabled: false
        //    },



        //};

        //// Sample options for first chart
        //$scope.currentMonthPrediction = {
        //    chart: {
        //        type: 'line',
        //        events: {
        //            load: function (event) {


        //            }
        //        }
        //    },
        //    title: {
        //        text: 'Current Month Prediction'
        //    },
        //    xAxis: {
        //        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
        //    },
        //    plotOptions: {
        //        series: {
        //            cursor: 'pointer',
        //            point: {
        //                events: {
        //                    click: function () {
        //                        alert('Category: ' + this.category + ', value: ' + this.y);
        //                    }
        //                }
        //            }
        //        }
        //    },
        //    series: [],
        //    credits: {
        //        enabled: false
        //    },



        //};

        //// Sample options for first chart
        //$scope.nextMonthPrediction = {
        //    chart: {
        //        type: 'line',
        //        events: {
        //            load: function (event) {


        //            }
        //        }
        //    },
        //    title: {
        //        text: 'Next Month Prediction'
        //    },
        //    xAxis: {
        //        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
        //    },
        //    plotOptions: {
        //        series: {
        //            cursor: 'pointer',
        //            point: {
        //                events: {
        //                    click: function () {
        //                        alert('Category: ' + this.category + ', value: ' + this.y);
        //                    }
        //                }
        //            }
        //        }
        //    },
        //    series: [],
        //    credits: {
        //        enabled: false
        //    },



        //};


        //function getSensorList() {

        //    $http({
        //        url: config.restServer + "api/getallsensors/" + localStorage.getItem("userId"),
        //        dataType: 'json',
        //        headers: {
        //            "Content-Type": "application/json"
        //        }
        //    }).success(function (response) {
        //        console.log("Get Sensor list response [Info]::", response);
        //        $scope.sensors = response;
        //        $scope.selectedSensor = $scope.sensors[0];

        //    })
        //        .error(function (error) {
        //            alert("Error : " + JSON.stringify(error));
        //        });

        //}
        //getSensorList();
        //$scope.showSensorDetails = function (sensor) {
        //    console.log("Sensor ::", sensor);
        //    $scope.selectedSensor = sensor;
        //}
        //function getRecommendation() {
        //    $http({
        //        url: config.restServer + "api/getrecommendations/" + localStorage.getItem("userId"),
        //        dataType: 'json',
        //        headers: {
        //            "Content-Type": "application/json"
        //        }
        //    }).success(function (response) {
        //        console.log("Get Recommendation list [Info]::", response);
        //        $scope.recommendations = response;

        //    })
        //    .error(function (error) {
        //            alert("Error : " + JSON.stringify(error));
        //    });
        //}
        //getRecommendation();

        //function getInsight() {
        //    $http({
        //        url: config.restServer + "api/getinsightdata/" + localStorage.getItem("userId"),
        //        dataType: 'json',
        //        headers: {
        //            "Content-Type": "application/json"
        //        }
        //    }).success(function (response) {
        //        console.log("Get Insight list [Info]::", response);
        //        $scope.insight = response;
        //        console.log($scope.insight);
        //        $scope.insight.ConsumptionValue = Math.round($scope.insight.ConsumptionValue)/1000;
        //        $scope.insight.PredictedValue = Math.round($scope.insight.PredictedValue)/1000;
        //        $scope.insight.overused = response.ConsumptionValue - response.PredictedValue; 
        //        if ($scope.insight.overused>0) {
        //            $scope.usage = "OVERUSED";
        //        }                          
        //        else {
        //            $scope.usage = "UNDERUSED";
        //        }
        //      })
        //    .error(function (error) {
        //            alert("Error : " + JSON.stringify(error));
        //    });
        //}
        //getInsight();

    });


