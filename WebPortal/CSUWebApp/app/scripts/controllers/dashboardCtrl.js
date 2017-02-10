var restServer = "http://powergridrestservice.azurewebsites.net/";
angular.module('WebPortal')
    .controller('dashboardCtrl', function ($scope, $http, $location, $state, Token, weatherServiceFactory, $modal) {
        $scope.weather = weatherServiceFactory;
        $scope.weather.search();
        $scope.username = localStorage.getItem("UserName");
        $scope.lastname = localStorage.getItem("LastName");
        $scope.li_css = ['background-color: #192c1f;color:#ffd600;', 'side-menu-li-inactive', 'side-menu-li-inactive'];
        $scope.li_color = ['white', 'white', 'red'];    

        
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
                $scope.li_css[0] = 'background-color: #192c1f;color:#ffd600;';
                $scope.li_css[1] = 'background-color: #31573e;color:white;';
                $scope.li_css[2] = 'background-color: #31573e;color:white;';
                $scope.li_css[3] = 'background-color: #192c1f;color:white;';
            }
            else if (index == 1) {
                $scope.li_css[0] = 'background-color: #31573e;color:white;';
                $scope.li_css[1] = 'background-color: #192c1f;color:#ffd600;';
                $scope.li_css[2] = 'background-color: #31573e;color:white;';
                $scope.li_css[3] = 'background-color: #192c1f;color:white;';
            }
            else if (index == 2) {
                
                $scope.li_css[0] = 'background-color: #31573e;color:white;';
                $scope.li_css[1] = 'background-color: #31573e;color:white;';
                $scope.li_css[2] = 'background-color: #192c1f;color:#ffd600;';
                $scope.li_css[3] = 'background-color: #31573e;color:white;';
            }
            else if (index == 3) {

                $scope.li_css[0] = 'background-color: #31573e;color:white;';
                $scope.li_css[1] = 'background-color: #31573e;color:white;';
                $scope.li_css[2] = 'background-color: #31573e;color:white;';
                $scope.li_css[3] = 'background-color: #192c1f;color:#ffd600;';
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