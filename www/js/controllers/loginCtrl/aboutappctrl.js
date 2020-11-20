myApp.controller('aboutappctrl', function (HOSTNAME, $scope, $window, $http, $state, $ionicPopup, $rootScope, $ionicHistory, $timeout, $ionicLoading, $ionicNavBarDelegate, $ionicPlatform,$cordovaFacebook) {

  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  console.log("########OrganizationID######" + $scope.OrganizationID);

 $scope.AppName;
 $scope.AppPackageName;
 $scope.AppVersionCode;
 $scope.AppVersion;

   $scope.LastUpdated = 'Sep 28, 2020';

    $scope.loadFunction = function () {
    cordova.getAppVersion.getAppName().then(function(name){
        // My App Name
         $scope.AppName = name;
    });
    cordova.getAppVersion.getPackageName().then(function(pkgname){
        // com.companyname.appname
         $scope.AppPackageName = pkgname;
    });
    cordova.getAppVersion.getVersionCode().then(function(version){
        // 10000
        $scope.AppVersionCode = version;
    });

      cordova.getAppVersion.getVersionNumber().then(function(versionNumber){
          // 1.0.0
         $scope.AppVersion = versionNumber;
      });
 //     $scope.today_DT = convert_DT(new Date());
      // $ionicLoading.show();

    };
   $scope.loadFunction();
document.addEventListener("deviceready", function (){
                                                 window.screen.orientation.unlock(); // or ‘portrait’
                                                 }, false);
});
