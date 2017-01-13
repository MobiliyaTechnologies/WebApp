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
var tileEmbedURL = "https://app.powerbi.com/embed?dashboardId=09821193-5c76-4a55-b960-74815806ecac&tileId=37167b28-d3ec-4d9e-b937-405f0b96bb87";
var donutTileURL = "https://app.powerbi.com/embed?dashboardId=09821193-5c76-4a55-b960-74815806ecac&tileId=baecd6f4-7ff1-4aea-a882-fdb1dea1f885";

angular.module('WebPortal')
    .controller('overviewCtrl', function ($scope, $http, $location, Token, config, $timeout) {
        $scope.userId = localStorage.getItem("userId");
        $scope.meterList = [];
        $scope.urls = [];

        /**
         * 
         */
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
        /**
         * 
         */
        function getMeterList() {
            $http({
                url: config.restServer + "api/getmeterlist/" + $scope.userId,
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log("Get Meter List [Info] ::", response);
                $scope.meterList = response;
                $scope.options = {
                    dataTextField: 'Name',
                    dataSource: $scope.meterList
                }
                getMonthlyConsumption();
                getUrls(0);
                for (var i in $scope.meterList) {
                    createBasePushPin($scope.meterList[i]);
                }

            })
            .error(function (error) {
                    console.log("Error : " + JSON.stringify(error));
            });
        }
        /**
         * 
         * @param index
         */
        function getUrls(index) {
            if (index < $scope.meterList.length) {
                $http({
                    url: config.restServer + "api/getpowerbiurl/" + $scope.userId + '/' + $scope.meterList[index].Serial,
                    dataType: 'json',
                    method: 'Get',
                }).success(function (response) {
                    //console.log("Get Meter Urls of " + $scope.meterList[index].Serial + "::", response);
                    response.Serial = $scope.meterList[index].Serial;
                    response.Name = $scope.meterList[index].Name;
                    $scope.urls.push(response);
                    getUrls(index + 1);
                })
                .error(function (error) {
                        // alert("Error : " + JSON.stringify(error));
                    console.log("Error :", JSON.stringify(error));
                });
            }
            else {
                console.log("Get Meter Urls [Info] ::",$scope.urls);
            }
        }
        /**
         * 
         */
        function getMonthlyConsumption() {
            $http({
                url: config.restServer + "api/getmonthlyconsumption/" + $scope.userId,
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log("Get Monthly Consumption [Info] ::", response);
                $scope.MonthlyConsumption = response;
                for (var j = 0; j < $scope.meterList.length;j++) {
                   // console.log("$scope.meterList", $scope.meterList[j]);
                    var index = $scope.MonthlyConsumption.findIndex(function (item, i) {
                        return item.Powerscout == $scope.meterList[j].Serial;
                    });
                    if (index >=0) {
                        $scope.MonthlyConsumption[index].Latitude = $scope.meterList[j].Latitude;
                        $scope.MonthlyConsumption[index].Longitude = $scope.meterList[j].Longitude;
                        $scope.MonthlyConsumption[index].Name = $scope.meterList[j].Name;
                        createColorPushPin($scope.MonthlyConsumption[index]);
                        
                    }
                }
            })
            .error(function (error) {
                    console.log("Error : " + JSON.stringify(error));
            });
        }
        /**
         * 
         * @param meter
         */
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
        /**
         * 
         * @param meter
         */
        function createColorPushPin(meter) {
            
            var location = new Microsoft.Maps.Location(meter.Latitude, meter.Longitude);
            var radius = 15;
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
                radius = 25;
            }
            else if (meter.Monthly_KWH_Consumption > 0 && meter.Monthly_KWH_Consumption <= 1000) {
                if (meter.Monthly_KWH_Consumption < 500) {
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
            var mname = meter.Name.substring(0, 10)+'..';
            var pushpin2 = new Microsoft.Maps.Pushpin(location, {
                icon: svg.join(''),
                anchor: new Microsoft.Maps.Point(radius, radius), text: mname, textOffset: new Microsoft.Maps.Point(0, 10)

            });
            pushpin2.MeterSerial = meter.Powerscout;
            pushpin2.MeterName = meter.Name;
            pushpin2.Monthly_Electric_Cost = meter.Monthly_electric_Cost;
            pushpin2.Monthly_KWH_Consumption = meter.Monthly_KWH_Consumption;
            map.entities.push(pushpin2);
            Microsoft.Maps.Events.addHandler(pushpin2, 'click', onPushpinClicked);
            Microsoft.Maps.Events.addHandler(pushpin2, 'mouseover', onPushpinMouseOver);
            Microsoft.Maps.Events.addHandler(pushpin2, 'mouseout', onPushpinMouseOut);
        }
        /**
         * 
         * @param args
         */
        function onPushpinClicked(args) {
            
            var index = $scope.urls.findIndex(function (item, i) {
                return item.Serial == args.target.MeterSerial;
            });
            $scope.MeterName = args.target.MeterName;
            
            if (index >= 0) {
                if ($scope.urls[index].Report != undefined) {
                    embedReport($scope.urls[index].Report);
                    $scope.$apply();
                    $("#scrolldiv").animate({
                        scrollTop: $("#report").offset().top
                    });
                }
            }

        }
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
                        scrollTop: $("#reportscroll").offset().top+400
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
                   

            });

            //map.setView(new Microsoft.Maps.Location(e.dataItem.Latitude, e.dataItem.Longitude), 18, { animation: true });
            //map.setView(new Microsoft.Maps.Location(e.dataItem.Latitude, e.dataItem.Longitude), map.getZoom(), {
            //    "animate": true,
            //    "pan": {
            //        "duration": 10
            //    }
            //});
        }

        function embedReport(reportURL) {
            var embedUrl = reportURL;
            if ("" === embedUrl) {
                console.log("No embed URL found");
                return;
            }
            iframe = document.getElementById('reportIframe');
            iframe.src = embedUrl;
            iframe.onload = postActionLoadReport;
        };

        function postActionLoadReport() {
            var accessToken = Token.data.accesstoken
            if ("" === accessToken) {
                console.log("Access token not found");
                return;
            }
            var m = { action: "loadReport", accessToken: accessToken };
            var message = JSON.stringify(m);
            iframe = document.getElementById('reportIframe');
            iframe.contentWindow.postMessage(message, "*");;
        }

       


        // Sample options for first chart
        $scope.currentMonth = {
            chart: {
                type: 'line',
                events: {
                    load: function (event) {
                        
                        
                    }
                }
            },
            title: {
                text: 'Current Month'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                alert('Category: ' + this.category + ', value: ' + this.y);
                            }
                        }
                    }
                }
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
            

        };
        $scope.nextMonth = {
            chart: {
                type: 'line',
                events: {
                    load: function (event) {

                       
                    }
                }
            },
            title: {
                text: 'Next Month'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                alert('Category: ' + this.category + ', value: ' + this.y);
                            }
                        }
                    }
                }
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]


        };
        $scope.years = [2016, 2017];
        $scope.selectedYear = 2016;
        $scope.changeYear = function () {
            console.log($scope.selectedYear);
            $scope.YearlyConsumption.series = [];
            $scope.YearlyConsumption.loading = true;       
            $scope.YearlyConsumption.title.text='Total Electricity consumption (' + $scope.selectedYear + ')';   
            getYearlyConsumption();
        }
        function getYearlyConsumption() {
            $http({
                url: config.restServer + "api/getmonthwiseconsumption/" + $scope.userId + "/" + $scope.selectedYear,
                dataType: 'json',
                method: 'Get',
            }).success(function (response) {
                console.log("Get Month Wise(Yearly) Consumption [Info] ::", response);
                $scope.YearlyConsumption.loading = false;   
                $scope.YearlyConsumption.series = [];
                for (var i = 0; i < response.length; i++) {
                    var data = [];
                    data.push(response[i].MonthWiseConsumption.Jan);
                    data.push(response[i].MonthWiseConsumption.Feb);
                    data.push(response[i].MonthWiseConsumption.Mar);
                    data.push(response[i].MonthWiseConsumption.Apr);
                    data.push(response[i].MonthWiseConsumption.May);
                    data.push(response[i].MonthWiseConsumption.Jun);
                    data.push(response[i].MonthWiseConsumption.Jul);
                    data.push(response[i].MonthWiseConsumption.Aug);
                    data.push(response[i].MonthWiseConsumption.Sep);
                    data.push(response[i].MonthWiseConsumption.Oct);
                    data.push(response[i].MonthWiseConsumption.Nov);
                    data.push(response[i].MonthWiseConsumption.Dec);
                    $scope.YearlyConsumptionChart.reflow();
                    $scope.YearlyConsumption.series.push({
                        id: response[i].PowerScout,
                        stack: 'meter',
                        data: data,
                        name: response[i].Name,
                        serial: response[i].PowerScout,
                    });

                }

            })
            .error(function (error) {       
               console.log("Error : " + JSON.stringify(error));
            });
        }
        getYearlyConsumption();
       
       



        $scope.YearlyConsumption = {
            chart: {
                type: 'column',
                
                events: {
                    drilldown: function (e) {
                        console.log(e.point); // The point, with name, that was clicked
                    },
                    load: function (event) {
                        $scope.YearlyConsumptionChart = this;
                    }
                },
               
                lang: {
                    loading: 'Loading...'
                }


            },
            title: {
                text: 'Total Electricity consumption (' + $scope.selectedYear+')'
            },

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Total Consumption'
                }
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total Consumptiom: ' + this.point.stackTotal;
                }
            },

            plotOptions: {
                column: {
                    stacking: 'normal'
                },
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                console.log(this.series.name);
                                //alert('Category: ' + this.category + ', value: ' + this.y);
                                onSeriesClicked(this.series.name);
                            }
                        }
                    }
                }
            },

            series: [
               

            ],
            loading: true,
            credits: {
                enabled: false
            },
         
        }
       
   
        


       

    });


