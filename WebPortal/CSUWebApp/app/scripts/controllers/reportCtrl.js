var reportURL = "https://app.powerbi.com/reportEmbed?reportId=ff04edce-c5c4-471c-8a44-5fb954685e32";
angular.module('WebPortal')
    .controller('reportCtrl', function ($scope, $http, $location, $state, Auth, config, Token) {
        console.log("[Info] :: Report Controller Loaded")
        //Check for token if available display report or else get the token
        if (Token.data.accesstoken != '') {
            displayReport();
        }
        else {
            Token.update(displayReport);
        }    
        function displayReport() {
            if ("" === reportURL) {
                console.log("No embed URL found");
                return;
            }
            iframe = document.getElementById('genericReport');
            iframe.src = reportURL;
            iframe.onload = $scope.setIFrameSize;
        };      

        $scope.setIFrameSize = function () {
            var ogWidth = 700;
            var ogHeight = 600;
            var ogRatio = ogWidth / ogHeight;
            var windowWidth = $(window).width();
            var parentDivWidth = $(".iframe-class").parent().width();
            var newHeight = (parentDivWidth / ogRatio);
            $(".iframe-class").addClass("iframe-class-resize");
            $(".iframe-class-resize").css("width", parentDivWidth);
            $(".iframe-class-resize").css("height", newHeight);
            var accessToken = Token.data.accesstoken;
            if ("" === accessToken) {
                console.log("[Error] :: Access token not found");
                return;
            }     
            var m = { action: "loadReport", accessToken: accessToken, height: newHeight, width: parentDivWidth  };
            message = JSON.stringify(m);
            iframe = document.getElementById('genericReport');
            iframe.contentWindow.postMessage(message, "*");
        }

    });