var roles=[]
angular.module('WebPortal')
    .controller('dashboardCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, $rootScope, aadService, AclService, aadService ) {
        $scope.can = AclService.can;
        $scope.weather = weatherServiceFactory;
        $scope.weather.search();
        $scope.username = localStorage.getItem("UserName");
        $scope.lastname = localStorage.getItem("LastName");
        $scope.li_css = ['background-color: #192c1f;color:#ffd600;', 'side-menu-li-inactive', 'side-menu-li-inactive'];
        $scope.li_color = ['white', 'white', 'red'];
        $scope.li_css[0] = 'border-left:solid 5px #c6d82e;';
        $scope.li_css[1] = 'background-color: white;color:#192c1f;';
        $scope.li_css[2] = 'background-color: white;color:#192c1f;';
        $scope.li_css[3] = 'background-color: white;color:#192c1f;';
        $scope.li_css[4] = 'background-color: white;color:#192c1f;';
        aadService.signIn(function (b2cSession) {
        });


        //if avatar is not loaded set default avatar
        if (localStorage.getItem("Avatar") == "null") {
            $scope.avatar = "Avatar_1.png";
        }
        else {
            $scope.avatar = localStorage.getItem("Avatar");
        }
        

        $scope.makeActive = function (index) {
            if (index == 0) {
                $scope.li_css[0] = 'border-left:solid 5px #c6d82e;';
                $scope.li_css[1] = 'border-left:solid 1px;';
                $scope.li_css[2] = 'border-left:solid 1px;';
                $scope.li_css[3] = 'border-left:solid 1px;';
                $scope.li_css[4] = 'border-left:solid 1px;';
            }
            else if (index == 1) {
                $scope.li_css[0] = 'border-left:solid 1px;';
                $scope.li_css[1] = 'border-left:solid 5px #c6d82e;';
                $scope.li_css[2] = 'border-left:solid 1px;';
                $scope.li_css[3] = 'border-left:solid 1px;';
                $scope.li_css[4] = 'border-left:solid 1px;';
            }
            else if (index == 2) {

                $scope.li_css[0] = 'border-left:solid 1px;';
                $scope.li_css[1] = 'border-left:solid 1px;';
                $scope.li_css[2] = 'border-left:solid 5px #c6d82e;';
                $scope.li_css[3] = 'border-left:solid 1px;';
                $scope.li_css[4] = 'border-left:solid 1px;';
            }
            else if (index == 3) {

                $scope.li_css[0] = 'border-left:solid 1px;';
                $scope.li_css[1] = 'border-left:solid 1px;';
                $scope.li_css[2] = 'border-left:solid 1px;';
                $scope.li_css[3] = 'border-left:solid 5px #c6d82e;';
                $scope.li_css[4] = 'border-left:solid 1px;';
                $scope.alertCount = 0;
            }
            else if (index == 4) {

                $scope.li_css[0] = 'border-left:solid 1px;';
                $scope.li_css[1] = 'border-left:solid 1px;';
                $scope.li_css[2] = 'border-left:solid 1px;';
                $scope.li_css[3] = 'border-left:solid 1px;';
                $scope.li_css[4] = 'border-left:solid 5px #c6d82e;';
            }

        }




        $scope.items = ['item1', 'item2', 'item3'];
        $scope.images = [{ src: "Avatar_1.png", color: 'black' }, { src: "Avatar_2.png", color: 'black' },
        { src: "Avatar_3.png", color: 'black' }, { src: "Avatar_4.png", color: 'black' },
        { src: "Avatar_5.png", color: 'black' }, { src: "Avatar_6.png", color: 'black' },
        { src: "Avatar_7.png", color: 'black' }, { src: "Avatar_8.png", color: 'black' }

        ];

        /**
         * Function to open Change avatar popup
         */
        $scope.openPopup = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'changeAvatarModal.html',
                controller: 'changeAvatarCtrl',
                size: size,
                resolve: {
                    images: function () {
                        return $scope.images;
                    }
                }

            }).result.then(function (result) {
                $scope.avatar = result.src;
                },function () {
                    // Cancel
                });
        };

        /**
        * Function to subscribe topic for firebase  
        */
        function subscribeTopic(token) {
            $http({
                url: "https://iid.googleapis.com/iid/v1/" + token + "/rel/topics/Alerts",
                dataType: 'json',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "key=AIzaSyBkgKls7ACvfll8pYuuicCr2e9r17_55Eg"

                }
            }).then(function (response) {
                console.log("[Info] :: Successfully subscribed to topic 'Alerts'")

            })
            .catch(function (error) {
                    console.log("Error : " + JSON.stringify(error));
            });
        }

        
        /**
        * Firebase Credentials
        */
        
        $http.get('firebaseConfig.json')
            .then(function (data, status, headers) {
                if (data.data.ApiKey) {
                    localforage.setItem('ApiKey', data.data.ApiKey);
                    localforage.setItem('AuthDomain', data.data.AuthDomain);
                    localforage.setItem('DatabaseURL', data.data.DatabaseURL);
                    localforage.setItem('StorageBucket', data.data.StorageBucket);
                    localforage.setItem('NotificationSender', data.data.NotificationSender);                   
                    
                    var config = {
                        apiKey: data.data.ApiKey,
                        authDomain: data.data.AuthDomain,
                        databaseURL: data.data.DatabaseURL,
                        storageBucket: data.data.StorageBucket,
                        messagingSenderId: data.data.NotificationSender
                    };
                    iniateFirebase(config);
                }
            })
            .catch(function (data, status, headers) {
                // log error
                alert('error');
         });
        function iniateFirebase(config) {
            firebase.initializeApp(config);
            /**
            * Function to get permission of firebase from user
            */
            const messaging = firebase.messaging();
            messaging.requestPermission()
                .then(function () {
                    console.log("[Info] :: User Granted Permission");
                    return messaging.getToken();
                })
                .then(function (token) {
                    console.log("[Info] ::  Registration token ", token);
                    subscribeTopic(token);
                })
                .catch(function (err) {
                    console.log("[Info] :: User not Granted Permission [Error]", err);
                })

            messaging.onMessage(function (payload) {
                $scope.alertCount++;
            });
        }
        $scope.alertCount = 0;
       
        $scope.showAlerts = function () {
            $state.go('alerts');
        }

        $scope.changeState=function(state){
            $state.go(state);
        }

         
        $scope.logoutb2c = function () {           
            aadService.logout();
        }        
       
    });

angular.module('WebPortal').controller('changeAvatarCtrl', function ($scope, $modalInstance, images, $http, Restservice ) {

    $scope.selectImage = function (index) {
        for (var i = 0; i < $scope.images.length; i++) {
            if (index === i) {
                $scope.images[i].color = 'red';

            } else {
                $scope.images[i].color = 'black';
            }
        }
        $scope.selected = {
            image: $scope.images[index]
        };
    };
    $scope.images = images;

    /**
     * Function to Upload Image 
     */
    $scope.ok = function () {  
        var JSONobj = new Object();
        JSONobj.Avatar = $scope.selected.image.src;
        Restservice.put('api/UpdateUser', JSONobj, function (err, response) {
            if (!err) {
                console.log("Change Avatar response [Info] ::", response);
                localStorage.setItem("Avatar", $scope.selected.image.src);
                $modalInstance.close($scope.selected.image);
            }
            else {
                console.log(err);
            }
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };





});
 /**
  * Controller for configuration Popup
  */
angular.module('WebPortal').controller('configurationCtrl', function ($scope, $modalInstance, $http, Restservice) {
});