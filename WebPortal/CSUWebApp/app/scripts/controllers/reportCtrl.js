﻿var reportURL = "https://app.powerbi.com/reportEmbed?reportId=3d45933e-386e-4773-9c1f-0c26ccfd7e3b";
angular.module('WebPortal')
    .controller('reportCtrl', function ($scope, $http, $location, $state, config, Token) {
        console.log("[Info] :: Report Controller Loaded")
        //Check for token if available display report or else get the token
        if (Token.data.accesstoken != '') {
        }
        else {
            Token.update(function () { });
        }    
        function getPowerBiUrls() {
            console.log("Get");
            $http.get('powerBI.json')
                .then(function (data, status, headers) {
                    $scope.powerBiUrls = data.data;
                    if ($scope.powerBiUrls.feedback) {   
                        embedReport($scope.powerBiUrls.university.summary, 'summary');
                        embedReport($scope.powerBiUrls.university.summarydetails, 'summarydetails');
                    }
                })
                .catch(function (data, status, headers) {
                    console.log('error',data);
                });
        }
        getPowerBiUrls();



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