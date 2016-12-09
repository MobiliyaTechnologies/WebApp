var restServer = "http://powergridrestservice.azurewebsites.net/";
var weatherTileURL1 = "https://app.powerbi.com/embed?dashboardId=cea6812f-9d03-4394-ae7b-cbdb779d9b6f&tileId=2c0f4146-6b11-4a7f-8af0-96b6ccb1d391";
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
                //alert("Response : " + JSON.stringify(response)); 
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
            iframe.src = embedTileUrl + "&width=" + 500 + "&height=" + 300;
            iframe.onload = postActionWeatherLoadTile;
        }

        function postActionWeatherLoadTile() {
            // get the access token.
            //accessToken = access_Token;
            console.log("Weather Loading");
            var accessToken = Token.data.accesstoken;

            // return if no a
            if ("" === accessToken) {
                console.log("Access token not found");
                return;
            }

            var h = 130;
            var w = 200;

            // construct the push message structure
            var m = { action: "loadTile", accessToken: accessToken, height: h, width: w };
            var message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('weatherIFrame1');
            iframe.contentWindow.postMessage(message, "*");;
        }

        embedWeatherTile();
  });