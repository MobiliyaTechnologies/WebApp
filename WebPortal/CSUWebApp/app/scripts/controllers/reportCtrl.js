/**
 * @ngdoc Controller
 * @name controller:reportCtrl
 * @author Jayesh Lunkad
 * @description 
 * # reportCtrl
 * 
 */
angular.module('WebPortal')
    .controller('reportCtrl', function ($scope, $http, $location, $state, config, Token, Restservice ) {
        console.log("[Info] :: Report Controller Loaded");
        $scope.configurationError = true;
        $scope.loadingpowerBi = true;
        $scope.powerBiUrls = {
            'organization': {},
            'premise': {},
            'building': {},
            'feedback': {}
        }
        //Check for token if available display report or else get the token
        if (Token.data.accesstoken != '') {
        }
        else {
            Token.update(function () { });
        }    
        function getPowerBiUrls() {
            //$http.get('powerBI.json')
            //    .then(function (data, status, headers) {
            //        $scope.powerBiUrls = data.data;
            
                    if ($scope.powerBiUrls.organization) {   
                        embedReport($scope.powerBiUrls.organization.summary, 'summary');
                        embedReport($scope.powerBiUrls.organization.summarydetails, 'summarydetails');
                    }
                //})
                //.catch(function (data, status, headers) {
                //    console.log('error',data);
                //});
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
                                        $scope.powerBiUrls.premise[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }
                                }

                                break;
                            case "BuildingPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.powerBiUrls.building[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }
                                }
                                break;

                            case "OrganizationPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.powerBiUrls.organization[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
                                    }
                                    getPowerBiUrls();
                                   
                                    $scope.configurationError = false;
                                }
                                $scope.loadingpowerBi = false;
                                break;

                            case "FeedbackPowerBI":
                                if (response[i].ApplicationConfigurationEntries.length > 0) {
                                    for (var j = 0; j < response[i].ApplicationConfigurationEntries.length; j++) {
                                        $scope.powerBiUrls.feedback[response[i].ApplicationConfigurationEntries[j].ConfigurationKey] = response[i].ApplicationConfigurationEntries[j].ConfigurationValue;
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



        var iframe;
        function embedReport(reportURL, iframeId) {
            var embedUrl = reportURL;
            if ("" === embedUrl) {
                console.log("No embed URL found");
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
                console.log("Access token not found");
                return;
            }
            var m = { action: "loadReport", accessToken: accessToken };
            var message = JSON.stringify(m);
            iframe = document.getElementById(iframeId);
            iframe.contentWindow.postMessage(message, "*");;
        }

    });