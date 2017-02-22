var restServer = "http://powergridrestservice.azurewebsites.net/";
angular.module('WebPortal')
    .controller('dashboardCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal) {
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
        
        if (localStorage.getItem("Avatar")=="null") {
            console.log("$scope.avatar", $scope.avatar);
            $scope.avatar = "Avatar_1.png";
        } 
        else {
            $scope.avatar = localStorage.getItem("Avatar");
        }

        $scope.logout = function () {
            console.log("logout [info] ::");
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
                
                $state.go('login');
               
            })
            .error(function (error) {
                alert("Error : " + JSON.stringify(error));
            });
        };
        
        $scope.makeActive = function(index){
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
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    images: function () {
                        return $scope.images;
                    }
                }

            }).result.then(function (result) {
                $scope.avatar = result.src;
            });
        };
        function subscribeTopic(token) {
            $http({
                url: "https://iid.googleapis.com/iid/v1/" + token + "/rel/topics/Alerts",
                dataType: 'json',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "key=AIzaSyBkgKls7ACvfll8pYuuicCr2e9r17_55Eg"

                }
            }).success(function (response) {
                console.log("Successfully subscribed to topic 'Alerts'")

            })
                .error(function (error) {
                    alert("Error : " + JSON.stringify(error));
                });
        }

        var config = {
            apiKey: "AIzaSyDOmoRglupPYwYYIr3lihNYKXUsEOVpezw",
            authDomain: "csu-android-app.firebaseapp.com",
            databaseURL: "https://csu-android-app.firebaseio.com",
            storageBucket: "csu-android-app.appspot.com",
            messagingSenderId: "107379564375"
        };
        firebase.initializeApp(config);
        const messaging = firebase.messaging();      
           messaging.requestPermission()
            .then(function () {
                console.log("[Info] :: User Granted Permission");
                return messaging.getToken();
            })
            .then(function (token) {
                console.log("Registration token ::", token);
                subscribeTopic(token);
            })
            .catch(function (err) {
                console.log("[Info] :: User not Granted Permission [Error]" ,err);
            })
           messaging.onMessage(function (payload) {
               console.log(payload);
               var el = document.querySelector('.notification');
               var count = Number(el.getAttribute('data-count')) || 0;
               el.setAttribute('data-count', count + 1);
               el.classList.remove('notify');
               el.offsetWidth = el.offsetWidth;
               el.classList.add('notify');
               if (count === 0) {
                   el.classList.add('show-count');
               }
           });
           $scope.showAlerts = function () {
               var el = document.querySelector('.notification');               
               el.setAttribute('data-count', 0);
               el.classList.remove('show-count');
               $state.go('alerts');
           }

           




    });
angular.module('WebPortal').controller('ModalInstanceCtrl', function ($scope, $modalInstance, images, $http) {

    $scope.selectItem = function (index) {
        for (var i = 0; i < $scope.images.length; i++) {
            if (index === i) {
                //$scope.image_css[index] =
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


    $scope.ok = function () {
        var JSONobj = new Object();
        JSONobj.Id = localStorage.getItem("userId");
        JSONobj.Avatar = $scope.selected.image.src;
        console.log(JSONobj);
        $http({
            url: restServer + "api/changeavatar",
            dataType: 'json',
            method: 'POST',
            data: JSONobj,
            headers: {
                "Content-Type": "application/json"

            }
        }).success(function (response) {
            console.log("Change Avatar response [Info] ::", response);
            localStorage.setItem("Avatar", response);
            $modalInstance.close($scope.selected.image);
        })
        .error(function (error) {
            alert("Error : " + JSON.stringify(error));
        });


       
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

   



});