var restServer = "http://powergridrestservice.azurewebsites.net/";
var weatherTileURL1 = "https://app.powerbi.com/embed?dashboardId=cea6812f-9d03-4394-ae7b-cbdb779d9b6f&tileId=06818120-ae10-4b35-9852-12aa953768bc";
angular.module('WebPortal')
    .controller('dashboardCtrl', function ($scope, $http, $location, $state,Token) {
        $scope.username = localStorage.getItem("UserName");
        $scope.lastname = localStorage.getItem("LastName");
        
        
        $scope.logout = function () {
            console.log("logout");
            var JSONobj = new Object();
            JSONobj.Email = localStorage.getItem("Email");
           
            $http({
                url: restServer + "api/signout",
                dataType: 'json',
                method: 'POST',
                data: JSONobj,
                headers: {
                    "Content-Type": "application/json"

                }
            }).success(function (response) {
                console.log(response);
                $state.go('login');
               
            })
            .error(function (error) {
                alert("Error : " + JSON.stringify(error));
            });
        };


        function embedWeatherTile() {
            var embedTileUrl = weatherTileURL1;
            if ("" === embedTileUrl) {
                console.log("No embed URL found");
                return;
            }
            iframe = document.getElementById('weatherIFrame1');
            iframe.src = embedTileUrl;
            iframe.onload = postActionWeatherLoadTile;
        }

        function postActionWeatherLoadTile() {
            console.log("Weather Loading");
            var accessToken = Token.data.accesstoken;

            // return if no a
            if ("" === accessToken) {
                console.log("Access token not found");
                return;
            }
            $scope.setIFrameSize();
            //var h = 200;
            //var w = 200;

            //// construct the push message structure
            //var m = { action: "loadTile", accessToken: accessToken, height: h, width: w };
            //var message = JSON.stringify(m);

            //// push the message.
            //iframe = document.getElementById('weatherIFrame1');
            //iframe.contentWindow.postMessage(message, "*");;



        }

        embedWeatherTile();
        var el = document.querySelector('.notification');

       
            var count = Number(el.getAttribute('data-count')) || 0;
            el.setAttribute('data-count', count + 1);
            el.classList.remove('notify');
            el.offsetWidth = el.offsetWidth;
            el.classList.add('notify');
            if (count === 0) {
                el.classList.add('show-count');
            }
       
            $scope.setIFrameSize=function() {
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
                var m = { action: "loadTile", accessToken: accessToken, height: newHeight, width: parentDivWidth };
                var message = JSON.stringify(m);

                // push the message.
                var iframe = document.getElementById('weatherIFrame1');
                iframe.contentWindow.postMessage(message, "*");;

                //} else {
                //    $(".iframe-class").removeClass("iframe-class-resize").css({ width: '', height: '' });
                //}
            }

  });