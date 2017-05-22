var roles=[]
angular.module('WebPortal')
    .controller('dashboardCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal, $rootScope, aadService, AclService ) {
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
        var config = {
            apiKey: "AIzaSyDOmoRglupPYwYYIr3lihNYKXUsEOVpezw",
            authDomain: "csu-android-app.firebaseapp.com",
            databaseURL: "https://csu-android-app.firebaseio.com",
            storageBucket: "csu-android-app.appspot.com",
            messagingSenderId: "107379564375"
        };
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
        $scope.alertCount = 0;
        messaging.onMessage(function (payload) {
            $scope.alertCount++;
        });
        $scope.showAlerts = function () {
            $state.go('alerts');
        }

        $scope.changeState=function(state){
            $state.go(state);
        }


        //applicaionID created in AD B2C portal
        var applicationId = '3bdf8223-746c-42a2-ba5e-0322bfd9ff76';
        var scope = 'openid ' + applicationId;
        var responseType = 'token id_token';
        var redirectURI = './redirect.html';

        //update the policy names with the exact name from the AD B2C policies blade
        var policies = {
            signInPolicy: "B2C_1_b2cSignin",
            editProfilePolicy: "B2C_1_b2cSiPe",
            signInSignUpPolicy: "B2C_1_b2cSiUpIn"
        };

        var loginDisplayType = {
            PopUp: 'popup',
            None: 'none',
            Page: 'page' //default is popup, if we use page option, webpage gets redirected to b2c login page then to redirect html.

        };

        var helloNetwork = {
            adB2CSignIn: 'adB2CSignIn',
            adB2CSignInSignUp: 'adB2CSignInSignUp',
            adB2CEditProfile: 'adB2CEditProfile'
        };       
        

        function policyLogout(network, policy) {
            
            console.log("Logoutttt");
            hello.logout(network, { force: true }).then(function (auth) {
                bootbox.alert('policy: ' + policy + ' You are logging out from AD B2C');
            }, function (e) {
                bootbox.alert('Logout error: ' + e.error.message);
            });
        }
        $scope.logoutb2c = function () {
            hello.init({
                adB2CSignIn: applicationId,
                adB2CSignInSignUp: applicationId,
                adB2CEditProfile: applicationId
            }, {
                    redirect_uri: '/redirect.html',
                    scope: 'openid ' + applicationId,
                    response_type: 'token id_token'
                });
            policyLogout(helloNetwork.adB2CSignIn, policies.signInPolicy);
        }

        //function configure() {
        //    $http.get('config.json')
        //        .then(function (data, status, headers) {
        //            console.log("Config ::",data);
        //            var modalInstance = $modal.open({
        //                templateUrl: 'configuration.html',
        //                controller: 'configurationCtrl',
                       

        //            }).result.then(function (result) {
        //                $scope.avatar = result.src;
        //            }, function () {
        //                // Cancel
        //            });

        //        })
        //        .catch(function (data, status, headers) {
        //            alert('error');
        //        });
        //}
        //configure();
       
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
angular.module('WebPortal').controller('configurationCtrl', function ($scope, $modalInstance, $http, Restservice) {
    
    $scope.configObj = {};

    $scope.localconfig = {};
    //"ConfigurationType": "", "ConfigKey": "", "ConfigValue": ""
    $scope.configList = [];
    $scope.campusPowerBiConfig = {};
    $scope.buildingPowerBiConfig = {};
    $scope.azureml = {};
    $scope.Piserver = {}
    $scope.update = function () {

        updateConfigOnserver();
        updateConfigOnLocal();
        


    } 
    function updateConfigOnLocal(){
        var campus = {
            campusPowerBiConfig: $scope.campusPowerBiConfig
        };
        var building = {
            buildingPowerBiConfig: $scope.buildingPowerBiConfig
        };
        jsonConcat($scope.localconfig, $scope.azureml);
        jsonConcat($scope.localconfig, campus);
        jsonConcat($scope.localconfig, building);

        //console.log("$scope.localconfig", $scope.localconfig);
        //console.log("campusPowerBiConfig", $scope.campusPowerBiConfig);
        //console.log("buildingPowerBiConfig", $scope.buildingPowerBiConfig);
        //console.log("azureml", $scope.azureml);
        //console.log("Piserver", $scope.Piserver);
        //console.log("Piserver", $scope.b2cConfig);
        
    }


    function updateConfigOnserver() {
        var configArr = [];
        var b2cCount = Object.keys($scope.b2cConfig).length;
        

        for (key in $scope.b2cConfig) {
            var obj = { "ConfigurationType": 0, "ConfigKey": key, "ConfigValue": $scope.b2cConfig[key] };
            $scope.configList.push(obj);
        }    
        for (key in $scope.Piserver) {
            var obj = { "ConfigurationType": 1, "ConfigKey": key, "ConfigValue": $scope.Piserver[key] };
            $scope.configList.push(obj);
        } 
        for (key in $scope.campusPowerBiConfig) {
            var obj = { "ConfigurationType": 2, "ConfigKey": key, "ConfigValue": $scope.campusPowerBiConfig[key] };
            $scope.configList.push(obj);
        } 
        for (key in $scope.buildingPowerBiConfig) {
            var obj = { "ConfigurationType": 2, "ConfigKey": key, "ConfigValue": $scope.buildingPowerBiConfig[key] };
            $scope.configList.push(obj);
        } 
        console.log("$scope.configList", $scope.configList);
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function jsonConcat(o1, o2) {
        for (var key in o2) {
            o1[key] = o2[key];
        }
        return o1;
    }





});