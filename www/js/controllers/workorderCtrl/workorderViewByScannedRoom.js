//controller for view all workorder ->manager
myApp.controller('workorderViewByScannedRoom', function (HOSTNAME, $ionicLoading, $scope, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicPlatform, $cordovaBarcodeScanner) {
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  // alert(empKey);
  $scope.getBackgroundGeolocation($scope.toServeremployeekey);
  // console.log("INSIDE workorderViewByScannedRoom");
  $scope.scrollMainToTop = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };
  $scope.scrollSmallToTop = function () {
    $ionicScrollDelegate.$getByHandle('small').scrollTop();
  };



  function convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  $scope.today_DT = convert_DT(new Date());
  $scope.doRefresh = function () {
    // $ionicLoading.show();
    console.log("employee key " + $scope.toServeremployeekey);
    $scope.myPromise = $http.get(HOSTNAME + "/mob_scanforWorkorder_empAng6?barcode=" + $rootScope.inbarcode + "&empkey=" + $scope.toServeremployeekey + "&ondate=" + $scope.today_DT + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        // $ionicLoading.hide();
        // console.log("response.length"+response.length);
        if (response.length > 0) {
          $scope.scrollToTop();
          response.forEach(function (data) {
            if (data.WorkorderTypeKey == - 1) {
              data.FloorName = "Refer Notes";
              data.ZoneName = "Refer Notes";
              data.RoomId = "Refer Notes";
            }
          })
          $rootScope.viewworkorder = response;
          // console.log($rootScope.viewworkorder);                     
        }
        else {
          $scope.scrollToTop();
          var alertPopup = $ionicPopup.alert({
            title: 'No work assigned to this room ' + $rootScope.inbarcode,
            template: 'Please, try again later!'
          });
        }
        //alert('We got a barcoden - Result: '+$scope.inbarcode);
      })
      .error(function (error) {
        var alertPopup = $ionicPopup.alert({
          title: 'Something went Wrong',
          template: 'Please relogin!'
        });
        $timeout(function () {
          $ionicLoading.hide();
          alertPopup.close();
          // uploadingPopup.close();
        }, 1000);
      })
      .finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };
  $scope.refreshPage = function () {
    console.log("called");
    return;
  };
  $scope.getEmployeeWorkorderByBarcode = function () {
    $ionicPlatform.ready(function () {
      //alert('Platform ready');
      //alert("BARCODE SCANNING");
      $cordovaBarcodeScanner
        .scan()
        .then(function (result) {
          $rootScope.inbarcode = result.text;
          // console.log("CHECKING BARCODE VALUE "+$rootScope.inbarcode);
          if ($rootScope.inbarcode.length > 0) {
            // $ionicLoading.show();
            console.log("employee key " + $scope.toServeremployeekey);

            $scope.myPromise = $http.get(HOSTNAME + "/mob_scanforWorkorder_empAng6?barcode=" + $rootScope.inbarcode + "&empkey=" + $scope.toServeremployeekey + "&ondate=" + $scope.today_DT + "&OrganizationID=" + $scope.OrganizationID)
              .success(function (response) {
                $scope.scrollToTop();
                // $ionicLoading.hide();
                // console.log("response.length"+response.length);
                if (response.length > 0) {
                  response.forEach(function (data) {
                    if (data.WorkorderTypeKey == - 1) {
                      data.FloorName = "Refer Notes";
                      data.ZoneName = "Refer Notes";
                      data.RoomId = "Refer Notes";
                    }
                  })
                  $rootScope.viewworkorder = response;
                  // console.log($rootScope.viewworkorder);                     
                }
                else {
                  var alertPopup = $ionicPopup.alert({
                    title: 'No work assigned to this room ' + $rootScope.inbarcode,
                    template: 'Please, try again later!'
                  });
                  $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    // uploadingPopup.close();
                  }, 1000);
                }
                //alert('We got a barcoden - Result: '+$scope.inbarcode);
              })
              .error(function (error) {
                var alertPopup = $ionicPopup.alert({
                  title: 'Something went Wrong',
                  template: 'Please relogin!'
                });
                $timeout(function () {
                  $ionicLoading.hide();
                  alertPopup.close();
                  // uploadingPopup.close();
                }, 1000);
              });
          }
        },
          // , function(error) {
          //     // An error occurred
          //     $scope.scanResults = 'Error: ' + error;
          // });
          $timeout(function () {
            var alertPopup = $ionicPopup.alert({
              title: 'Something went Wrong',
              template: 'Please relogin!'
            });
            $timeout(function () {
              $ionicLoading.hide();
              alertPopup.close();
              // uploadingPopup.close();
            }, 1000);
            $scope.refreshPage();
          }, 20));
    });
  };
  $scope.getEmployeeWorkorderByBarcode();
  //..........FOR GETTINGB WORKORDER DETAILS....ENDS........
  $scope.sttButton = false;


  $scope.scrollToTop = function () { //ng-click for back to top button
    $ionicScrollDelegate.scrollTop();
    $scope.sttButton = false;  //hide the button when reached top
  };
  $scope.scrollToTop();
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

  function convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
  };
  function to24Hour(str) {
    var tokens = /([10]?\d):([0-5]\d) ([ap]m)/i.exec(str);
    if (tokens === null) {
      return null;
    }
    if (tokens[3].toLowerCase() === 'pm' && tokens[1] !== '12') {
      tokens[1] = '' + (12 + (+tokens[1]));
    } else if (tokens[3].toLowerCase() === 'am' && tokens[1] === '12') {
      tokens[1] = '00';
    }
    return tokens[1] + ':' + tokens[2];
  }
  $scope.today_DT = convert_DT(new Date());
});
// myApp.controller('workorderViewByScannedRoom', function($scope,$window,$ionicScrollDelegate,$ionicPopup,$state,$interval,$timeout,$http,$rootScope,$cordovaBarcodeScanner,$ionicPlatform) {
//     console.log("INSIDE workorderViewByScannedRoom");
//           var empKey = window.localStorage.getItem('employeeKey');
//           var token = window.localStorage.getItem('token');
//           $window.localStorage['token'] = token;
//           var encodedProfile = token.split('.')[1];
//           var profile = JSON.parse(url_base64_decode(encodedProfile));
//           console.log(profile);
//           $scope.toServeremployeekey = profile.employeekey;
//     // alert(empKey);
//           $scope.scrollMainToTop = function() {
//                 $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
//           };
//           $scope.scrollSmallToTop = function() {
//                 $ionicScrollDelegate.$getByHandle('small').scrollTop();
//           };

// });

