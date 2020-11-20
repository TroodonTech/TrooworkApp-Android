
myApp.controller('fireBaseTrack', function (HOSTNAME, $window, $ionicLoading, $scope, $cordovaGeolocation, $ionicPopup, $rootScope, $ionicLoading, $ionicPlatform, $http, $ionicScrollDelegate, $state, $timeout, $interval) {
    $scope.findLocation = {};
    var token = window.localStorage.getItem('token');
    $window.localStorage['token'] = token;
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(url_base64_decode(encodedProfile));
    // console.log(profile);
    $rootScope.toServeremployeekey = profile.employeekey;
    $scope.OrganizationID = profile.OrganizationID;
    $scope.locations = {};
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }

    });
    // $ionicLoading.show();

    $scope.sttButton = false;
    $scope.showReqMessage = false;
    $scope.showMap = false;
    function convert_DT(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    $scope.scrollToTop = function () { //ng-click for back to top button
        $ionicScrollDelegate.scrollTop();
        $scope.sttButton = false;  //hide the button when reached top
    };

    $scope.getScrollPosition = function () {
        //monitor the scroll
        var moveData = $ionicScrollDelegate.getScrollPosition().top;
        // console.log(moveData);
        $scope.$apply(function () {
            if (moveData > 150) {
                $scope.sttButton = true;
            } else {
                $scope.sttButton = false;
            }
        }); //apply
    };  //getScrollPosition
    $scope.myPromise = $http.get(HOSTNAME + "/mob_getFireBaseEmployees?empkey=" + $rootScope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {// for firebase token and employee list
            // $ionicLoading.hide();
            $scope.employeeList = response;
            // console.log($scope.employeeListManagerView);
        })
        .error(function (error) {
            var errorPopup = $ionicPopup.alert({
                title: 'Something went Wrong',
                template: 'Please relogin!'
            });
            $timeout(function () {
                $ionicLoading.hide();
                errorPopup.close();
                // uploadingPopup.close();
            }, 1000);
        });
    $scope.errorMsg = false;



    $scope.searchEmployee = function (EmployeeKey) {
        $scope.errorMsg = false;
        $scope.showReqMessage = true;
        $scope.showMap = false;
        // console.log("empkey " + EmployeeKey.EmployeeKey);
        // console.log("empkey #" + $scope.EmployeeKey.EmployeeKey);
        console.log("empkey ##" + EmployeeKey);

        if (!EmployeeKey) {
            var alertPopup = $ionicPopup.alert({
                title: 'Live Tracking',
                template: 'Please select employee!'
            });
            $timeout(function () {
                $ionicLoading.hide();
                alertPopup.close();

            }, 1000);

            return;
        }
        var t = new Date();
        var y = t.getFullYear();
        var m = t.getMonth();
        var d = t.getDate();
        var h = t.getHours();
        var mi = t.getMinutes();
        var s = t.getSeconds();

        $scope.today_DT = convert_DT(new Date());
        var p = "";
        p = $scope.today_DT + " " + h + ":" + mi + ":" + s;
        // var token;
        // for (var i = 0; i < $scope.employeeList.length; i++) {
        //     if ($scope.employeeList[i].EmployeeKey == parseInt(EmployeeKey.EmployeeKey)) {
        //         token = $scope.employeeList[i].Token;
        //     }
        // }
        // if (!token) {
        //     var alertPopup = $ionicPopup.alert({
        //         title: 'Live Tracking',
        //         template: 'Employee login information unavailable!'
        //     });
        //     $timeout(function () {
        //         $ionicLoading.hide();
        //         alertPopup.close();

        //     }, 1000);

        //     return;
        // }


        $http.get(HOSTNAME + "/mob_sendNotification?Date=" + p + "&toEmp=" + EmployeeKey.EmployeeKey + "&empkey=" + $rootScope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                $scope.FireBaseGeoLocationID = response[0].FirebaseGeoLocationID;
                console.log(" FireBaseGeoLocationID --" + $scope.FireBaseGeoLocationID);
                if ($scope.inpro_inter) {

                    $interval.cancel($scope.inpro_inter);
                }
                if ($scope.FireBaseGeoLocationID != 'error') {
                    $ionicPlatform.ready(function () {

                        $scope.markers = [];
                        var myLat = "";
                        var myLon = "";
                        var startTime = new Date().getTime();
                        $scope.inpro_inter = $interval(function () {

                            $scope.myPromise = $http.get(HOSTNAME + "/mob_getFireBaseLocation?empKey=" + EmployeeKey.EmployeeKey + "&FireBaseGeoLocationID=" + $scope.FireBaseGeoLocationID + "&OrganizationID=" + $scope.OrganizationID)
                                .success(function (response) {
                                    // $ionicLoading.hide();
                                    $scope.locations = response;
                                    // console.log("response "+$scope.locations);
                                    if (response.length) {

                                        var Latitude = $scope.locations[0].Latitude;
                                        var Longitude = $scope.locations[0].Longitude;
                                        if (Latitude && Longitude) {
                                            console.log("data reached...");

                                            console.log(" repeat location :" + Latitude + Longitude);
                                            $interval.cancel($scope.inpro_inter);
                                            $scope.showReqMessage = false;


                                            // var Latitude  = $scope.locations[0].Latitude;
                                            // var Longitude  = $scope.locations[0].Longitude;
                                            $timeout(function () {
                                                var mapCanvas = document.getElementById('map');
                                                var mapOptions = {
                                                    center: new google.maps.LatLng(Latitude, Longitude),
                                                    zoom: 16,
                                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                                                }
                                                var map = new google.maps.Map(mapCanvas, mapOptions);
                                                $scope.map = map;




                                                // var employeeName = $scope.locations[0].EmployeeName;
                                                var locationDate = $scope.locations[0].positionDate;
                                                var locationTime = $scope.locations[0].positionTime;
                                                var contentString =
                                                    '<h5><b>Tracking...</b></h5>' +
                                                    '<div>' +
                                                    '<p>Location-Date:' + locationDate + '</p>' +
                                                    '<p>Location-Time:' + locationTime + '</p>' +
                                                    '</div>';
                                                // $scope.employeename = employeeName;
                                                // $scope.showEmployeeName = true;
                                                // console.log("locations "+Latitude +" "+Longitude);
                                                google.maps.event.addListenerOnce($scope.map, 'idle', function () {
                                                    var EmployeeMarker = new google.maps.Marker({
                                                        position: new google.maps.LatLng(Latitude, Longitude),
                                                        map: $scope.map
                                                    });
                                                    var infoWindow = new google.maps.InfoWindow({
                                                        content: contentString
                                                    });
                                                    google.maps.event.addListener(EmployeeMarker, 'click', function () {
                                                        infoWindow.open($scope.map, EmployeeMarker);
                                                    });

                                                });
                                                $scope.showMap = true;
                                            }, 500);




                                        }

                                        if (new Date().getTime() - startTime > 63000) {
                                            console.log("time out >1m...");
                                            $scope.showReqMessage = false;
                                            $scope.showMap = false;



                                            // $timeout(function () {
                                            //     $ionicLoading.hide();
                                            //     alertPopup.close();

                                            // }, 1000);

                                            $ionicPopup.alert({
                                                title: 'Search Failed',
                                                template: 'Employee did not accepted the request.'
                                            });

                                            $interval.cancel($scope.inpro_inter);
                                            return;
                                        }

                                        // if (Latitude && Longitude) {
                                        //     console.log(" map location :" + Latitude + Longitude);
                                        //     var mapOptions = {
                                        //         center: new google.maps.LatLng(Latitude, Longitude),
                                        //         zoom: 16,
                                        //         mapTypeId: google.maps.MapTypeId.ROADMAP
                                        //     }
                                        //     var map = new google.maps.Map(mapCanvas, mapOptions);

                                        //     var latlngPlace = new google.maps.LatLng(Latitude, Longitude);
                                        //     // var marker = new google.maps.Marker({
                                        //     //     map: map,
                                        //     //     position: latlngPlace
                                        //     // });

                                        //     $scope.map = map;

                                        //     google.maps.event.addListenerOnce($scope.map, 'idle', function(){

                                        //         var marker = new google.maps.Marker({
                                        //             map: $scope.map,
                                        //             animation: google.maps.Animation.DROP,
                                        //             position: latlngPlace
                                        //         });
                                        //         var EmployeeMarker = new google.maps.Marker({
                                        //             position: new google.maps.LatLng(Latitude, Longitude),
                                        //             map: $scope.map
                                        //         });
                                        //         var infoWindow = new google.maps.InfoWindow({
                                        //             content: contentString
                                        //         });
                                        //         google.maps.event.addListener(EmployeeMarker, 'click', function () {
                                        //             infoWindow.open($scope.map, EmployeeMarker);
                                        //         });

                                        //       });


                                        //     var employeeName = "Tracking...";
                                        //     var locationDate = $scope.locations[0].positionDate;
                                        //     var locationTime = $scope.locations[0].positionTime;
                                        //     var contentString =
                                        //         '<h5><b>' + employeeName + '</b></h5>' +
                                        //         '<div>' +
                                        //         '<p>Location-Date:' + locationDate + '</p>' +
                                        //         '<p>Location-Time:' + locationTime + '</p>' +
                                        //         '</div>';
                                        //     $scope.employeename = employeeName;
                                        //     $scope.showEmployeeName = true;
                                        //     console.log("locations----- " + Latitude + " " + Longitude);


                                        // }
                                    }
                                    else {
                                        $scope.errorMsg = true;
                                        $scope.showEmployeeName = false;
                                        x.innerHTML = "Location information is unavailable."
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Search Failed',
                                            template: 'Location information is unavailable.'
                                        });
                                        // $timeout(function () {
                                        //     $ionicLoading.hide();
                                        //     alertPopup.close();
                                        //     // uploadingPopup.close();
                                        // }, 1000);
                                        // $state.go('managerDashboard.findemployee');
                                        return;
                                    }
                                })
                                .error(function (error) {
                                    var errorPopup = $ionicPopup.alert({
                                        title: 'Something went Wrong',
                                        template: 'Please relogin!'
                                    });
                                    $timeout(function () {
                                        $ionicLoading.hide();
                                        errorPopup.close();
                                        // uploadingPopup.close();
                                    }, 1000);
                                });
                            var options = {
                                enableHighAccuracy: true,
                                timeout: 5000,
                                maximumAge: 0
                            };

                            var x = document.getElementById("error");
                            function error(err) {
                                $scope.errorMsg = true;
                                // console.warn('ERROR(' + err.code + '): ' + err.message);
                                switch (error.code) {
                                    case error.PERMISSION_DENIED:
                                        x.innerHTML = "User denied the request for Geolocation."
                                        break;
                                    case error.POSITION_UNAVAILABLE:
                                        x.innerHTML = "Location information is unavailable."
                                        break;
                                    case error.TIMEOUT:
                                        x.innerHTML = "The request to get user location timed out."
                                        break;
                                    case error.UNKNOWN_ERROR:
                                        x.innerHTML = "An unknown error occurred."
                                        break;
                                }
                                if ($scope.inpro_inter) {

                                    $interval.cancel($scope.inpro_inter);
                                }
                            };
                        }, 20000);
                    });

                }
                else {
                    $scope.showReqMessage = false;
                    var alertPopup = $ionicPopup.alert({
                        title: 'Live Tracking',
                        template: "Employee's app not updated / Employee not logged in !"
                    });

                    if ($scope.inpro_inter) {

                        $interval.cancel($scope.inpro_inter);
                    }

                    return;
                }

            });


    };
    // $scope.searchEmployee = function (setCount) {

    //     if (!$scope.EmployeeKey) {
    //         if (setCount == 0) {
    //             setCount = 1;
    //             var alertPopupNew = $ionicPopup.alert({
    //                 title: 'Live Tracking',
    //                 template: 'Please select employee!'
    //             });
    //             $timeout(function () {
    //                 $ionicLoading.hide();
    //                 // alertPopupNew.close();

    //             }, 1000);

    //             return;
    //         }
    //     }

    // };
document.addEventListener("deviceready", function (){
                                                 window.screen.orientation.unlock(); // or ‘portrait’
                                                 }, false);

});
