myApp.controller('logoutCtrl', function (HOSTNAME, $scope, $window, $http, $state, $ionicPopup, $rootScope, $ionicHistory, $timeout, $ionicLoading, $ionicNavBarDelegate, $ionicPlatform) {

  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  console.log("########OrganizationID######" + $scope.OrganizationID);
  $scope.logout = function (data, status, headers, config) {
    // alert('Clicked');
    var confirmPopup = $ionicPopup.confirm({
      title: 'Exit',
      template: 'Are you sure you want to quit?',
      cancelText: 'Cancel',
      okText: 'Quit'
    });
    confirmPopup.then(function (res) {
      if (res) {
        $scope.getBackgroundGeolocation($scope.toServeremployeekey);

        $ionicHistory.clearCache().then(function () {
          //now you can clear history or goto another state if you need

          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: true
          });
          $ionicNavBarDelegate.showBackButton(false);

        });

        $scope.welcome = '';
        $scope.isAuthenticated = false;
        delete $window.sessionStorage.token;
        $http.defaults.headers.common['Authorization'] = undefined;
        $window.localStorage.clear();
        $window.sessionStorage.clear();
        $window.localStorage.removeItem('employeekey');
        delete localStorage.employeekey;
        $state.go('login', {}, { reload: true });

      } else {
        return;
      }
    });

  };




  function convert_DT_Time(str) {// reduce one day for display
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    hour = date.getHours();
    min = date.getMinutes();

    sec = date.getSeconds();
    var D = [date.getFullYear(), mnth, day].join("-");
    var T = [hour, min, sec].join(":");

    return [D, T].join(" ");
  }



  $scope.getBackgroundGeolocation = function (employeekey) {
    console.log("inside getBackgroundGolocation ");
    var currDT = convert_DT_Time(new Date());
    console.log("inside quick workorder startDT " + currDT);
    // alert('employeekey'+employeekey);
    $ionicPlatform.ready(function () {

      console.log("[IONIC PLATFORM IS NOW READY]");

      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      // console.log("pos"+pos);
      function success(pos) {
        console.log("Inside function success");
        var crd = pos.coords;
        $rootScope.geolatitude = crd.latitude;
        $rootScope.geolongitude = crd.longitude;
        console.log('Your current position is:');
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        // console.log('employeekey: ' + employeekey);
        // console.log('More or less ' + crd.accuracy + ' meters.');
        $scope.backgroundlocation = {};
        $scope.backgroundlocation.geolatitude = $rootScope.geolatitude;
        $scope.backgroundlocation.geolongitude = $rootScope.geolongitude;
        $scope.backgroundlocation.EmployeeKey = employeekey;
        $scope.backgroundlocation.currenttime = currDT;
        $scope.backgroundlocation.OrganizationID = $scope.OrganizationID;
        // console.log($scope.backgroundlocation);
        $http.post(HOSTNAME + "/backgroundGeoLocation", $scope.backgroundlocation);
      };

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
      //  navigator.Geolocation.getCurrentPosition(success, error,options).then(resp => {
      //     console.log('resp');
      //   }, (err) => {
      //     console.log('Geolocation err: ');
      //     console.log(err);
      //   });

    });
  };


  $scope.locationTracker = function () {
    console.log("Entering function");
    console.log("EmployeeKey" + $scope.toServeremployeekey);
    $scope.getBackgroundGeolocation($scope.toServeremployeekey);
  }
  document.addEventListener("deviceready", function (){
                                                   window.screen.orientation.unlock(); // or ‘portrait’
                                                   }, false);
});
