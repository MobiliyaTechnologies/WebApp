var reportURL = "https://app.powerbi.com/reportEmbed?reportId=b0681dc8-a035-4c51-a3b6-fa0e04f914cf";
angular.module('WebPortal')
    .controller('reportCtrl', function ($scope, $http, $location, $state, Auth, config, Token) {
        if (Token.data.accesstoken != '') {
            displayGraph();
        }
        else {
            Token.update(displayGraph);
        }
        function displayGraph() {
            //embedTile();
            embedReport();
           
        }
        var width = 1024;
        var height = 768;
       
        function embedReport() {
            var embedUrl = reportURL;
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
            console.log(accessToken);
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


        $scope.setIFrameSize = function () {
            var ogWidth = 700;
            var ogHeight = 600;
            var ogRatio = ogWidth / ogHeight;
            var windowWidth = $(window).width();
            //if (windowWidth < 480) {
            var parentDivWidth = $(".iframe-class").parent().width();
            var newHeight = (parentDivWidth / ogRatio);
            $(".iframe-class").addClass("iframe-class-resize");
            $(".iframe-class-resize").css("width", parentDivWidth);
            $(".iframe-class-resize").css("height", newHeight);
            var accessToken = Token.data.accesstoken;
           


            var m = { action: "loadReport", accessToken: accessToken, height: newHeight, width: parentDivWidth  };
            message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('iFrameEmbedReport');
            iframe.contentWindow.postMessage(message, "*");;


        }

    });