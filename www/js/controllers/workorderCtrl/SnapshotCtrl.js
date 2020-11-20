
myApp.controller('SnapshotCtrl', function (HOSTNAME, $window, $ionicLoading, $scope, $cordovaGeolocation, $ionicPopup, $rootScope, $ionicLoading, $ionicPlatform, $http, $ionicScrollDelegate, $state, $stateParams) {
  $scope.findLocation = {};
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $rootScope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  var WorkOrderKey = $stateParams.workorderKey;
  console.log("WorkOrderKey " + WorkOrderKey);

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
  //  $scope.myPromise = $http.get(HOSTNAME +"/allemployees?empkey=" + $rootScope.toServeremployeekey+"&OrganizationID="+$scope.OrganizationID)
  //             .success(function(response)
  //             {
  //               // $ionicLoading.hide();
  //                 $scope.employeeList = response;
  //                 // console.log($scope.employeeListManagerView);
  //             })
  //             .error(function(error){
  //                   var errorPopup = $ionicPopup.alert({
  //                          title: 'Something went Wrong',
  //                          template: 'Please relogin!'
  //                                                    });
  //                   $timeout(function() {
  //                                 $ionicLoading.hide();
  //                                       errorPopup.close();
  //                                       // uploadingPopup.close();
  //                                    }, 1000);
  //             });
  // $scope.showEmployeeName = false;
  // $scope.errorMsg = false;

  $scope.searchEmployeeLocation = function () {

    console.log("entering into function:Workorderkey" + WorkOrderKey);
    // $ionicLoading.hide();
    $scope.errorMsg = false;
    if (WorkOrderKey) {
      console.log("entering into function:Workorderkey" + WorkOrderKey);
      // $scope.employeeName = $scope.findLocation.EmployeeKey.EmployeeKey;
      // $ionicLoading.show();
      $ionicPlatform.ready(function () {
        var posOptions = {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        };
        var loginPositionLatitude = $rootScope.geolatitude;
        var loginPositionLongitude = $rootScope.geolongitude;
        console.log("login positions " + loginPositionLatitude + " " + loginPositionLongitude);

        navigator.geolocation.getCurrentPosition(success, error, options);


        // Additional Markers //
        $scope.markers = [];
        var myLat = "";
        var myLon = "";
        $scope.myPromise = $http.get(HOSTNAME + "/getEmployeesLocationWithSnapshot?WorkOrderKey=" + WorkOrderKey)
          .success(function (response) {
            // $ionicLoading.hide();
            $scope.locations = response;
            // console.log("response "+$scope.locations);
            if (response.length) {
              var Latitude = $scope.locations[0].Latitude;
              console.log("Latitude:" + Latitude);
              var Longitude = $scope.locations[0].Longitude;
              console.log("Longitude" + Longitude);
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
              console.log("locationDate:" + locationDate);
              var locationTime = $scope.locations[0].positionTime;
              console.log("locationTime:" + locationTime);
              var contentString =

                '<div>' +
                '<p>Location-Date:' + locationDate + '</p>' +
                '<p>Location-Time:' + locationTime + '</p>' +
                '</div>';
              // $scope.employeename = employeeName;
              // $scope.showEmployeeName = true;
              // console.log("locations "+Latitude +" "+Longitude);                  
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


            }
            else {
              $scope.errorMsg = true;
              // $scope.showEmployeeName = false;
              x.innerHTML = "Location information is unavailable."
              var alertPopup = $ionicPopup.alert({
                title: 'Search Failed',
                template: 'Location information is unavailable.'
              });
              $timeout(function () {
                $ionicLoading.hide();
                alertPopup.close();
                // uploadingPopup.close();
              }, 1000);
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
        function success(pos) {
          var crd = pos.coords;
          var lat = crd.latitude;
          var lng = crd.longitude;
          var mapCanvas = document.getElementById('map');
          var mapOptions = {
            center: new google.maps.LatLng(myLat, myLon),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          var map = new google.maps.Map(mapCanvas, mapOptions);
          $scope.map = map;
          //**   Commenting the following to hide my location.
          // var map = new google.maps.Map(mapCanvas, mapOptions)     
          // var marker = new google.maps.Marker({
          //     position: new google.maps.LatLng(lat, lng),
          //     map: map
          // });
          // var infoWindow = new google.maps.InfoWindow({
          //     content: "My Location"
          // });
          // google.maps.event.addListener(marker, 'click', function () {
          //     infoWindow.open(map, marker);
          // });
          // google.maps.event.addDomListener(window, 'load', initialize);  dont need  this line
          // $scope.map = map;  
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
        };

      });
      // $state.go('managerDashboard.mapLoader'); 

    }
    // else{
    //   var alertPopup1 = $ionicPopup.alert({
    //                                        title: 'Search Failed',
    //                                        template: 'Select an Employee!'
    //                              });
    //   $timeout(function() {
    //                         $ionicLoading.hide();
    //                               alertPopup1.close();
    //                               // uploadingPopup.close();
    //                            }, 1000);
    // }            
  };


  $scope.searchEmployeeLocation();


});
