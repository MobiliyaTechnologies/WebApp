 /**
 * @ngdoc Controller
 * @name controller:dashboardCtrl
 * @author Jayesh Lunkad
 * @description 
 * # dashboardCtrl
 * 
 */
var roles = []
angular.module('WebPortal')
    .controller('dashboardCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, $rootScope, aadService, AclService, aadService ) {
        console.log("[Info] :: Login Controller loaded");  
        $scope.can = AclService.can;
        $scope.weather = weatherServiceFactory;
        $scope.weather.search();
        $scope.username = localStorage.getItem("UserName");
        $scope.lastname = localStorage.getItem("LastName");
       
        aadService.signIn(function (b2cSession) {
        });


        //if avatar is not loaded set default avatar
        if (localStorage.getItem("Avatar") == "null") {
            $scope.avatar = "Avatar_1.png";
        }
        else {
            $scope.avatar = localStorage.getItem("Avatar");
        }      
                
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
        function subscribeTopic(apikey,token, topic) {
            $http({
                url: "https://iid.googleapis.com/iid/v1/" + token + "/rel"+topic,
                dataType: 'json',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "key=" + apikey

                }
            }).then(function (response) {
                console.log("[Info] :: Successfully subscribed to topic '" + topic + "'");

            })
            .catch(function (error) {
                console.log("[Error]:: Subscribe Firebase Topic", error);
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
                    localforage.setItem('NotificationReceiver', data.data.NotificationReceiver);               
                    
                    var config = {
                        apiKey: data.data.ApiKey,
                        authDomain: data.data.AuthDomain,
                        databaseURL: data.data.DatabaseURL,
                        storageBucket: data.data.StorageBucket,
                        messagingSenderId: data.data.NotificationSender
                    };
                    iniateFirebase(data.data.ApiKey,config, data.data.NotificationReceiver);
                }
            })
            .catch(function (data, status, headers) {
                // log error
                console.log("[Error] :: Firebase Error",data);
         });
        function iniateFirebase(apikey,config,topic) {
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
                    subscribeTopic(apikey,token,topic);
                })
                .catch(function (err) {
                    console.log("[Error] :: User not Granted Permission", err);
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
 /**
  * Controller for Change Avatar Popup
  */
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
                console.log("[Info] :: Change Avatar response ", response);
                localStorage.setItem("Avatar", $scope.selected.image.src);
                $modalInstance.close($scope.selected.image);
            }
            else {
                
                console.log("[Error]:: Get Current User Details", err);
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