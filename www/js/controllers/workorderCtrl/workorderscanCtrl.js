//controller for view all workorder ->manager
myApp.controller('workorderscanCtrl', function (HOSTNAME, $cordovaFile, $ionicActionSheet, $cordovaFileTransfer, $scope, $ionicModal, $ionicSlideBoxDelegate, $stateParams, $cordovaCamera, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicPlatform, $cordovaBarcodeScanner, $ionicLoading, $interval) {
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log("INSIDE WORKORDERDETAILS...."+profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.isSupervisor = profile.IsSupervisor;
  $scope.OrganizationID = profile.OrganizationID;
  // alert($scope.isSupervisor);
  $scope.isDoubleScanDisabled = true;
  $scope.getBackgroundGeolocation($scope.toServeremployeekey);

  $scope.scrollMainToTop = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };
  $scope.scrollSmallToTop = function () {
    $ionicScrollDelegate.$getByHandle('small').scrollTop();
  };
  // console.log("PASSED SCROLL....");
  var barcode = $stateParams.barcode;

  var pageIndex = 0;
  $scope.hasData = 1;

  // console.log("CALLING SCROLL TO TOP....");
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



  //..........FOR GETTINGB WORKORDER DETAILS....ENDS........
  //..........For Scanned workorder.....start....
  $scope.loadFunction = function () {
    $scope.hasData = 1;
    pageIndex = 0;
    var ondate = convert_DT(new Date());
    console.log("ondate......" + ondate);
    $scope.myPromise = $http.get(HOSTNAME + "/mob_page_scanforWorkorder?barcode=" + barcode + "&empkey=" + $scope.toServeremployeekey + "&ondate=" + ondate + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)
      .success(function (response) {
        console.log("response.length" + response.length);
        if (response.length > 0) {
          $scope.viewworkorder = response;
          pageIndex = pageIndex + 1;
          // console.log($scope.viewworkorder);

        }
        else {
          $scope.hasData = 0;
          $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
          var alertPopup = $ionicPopup.alert({
            title: 'No work assigned to this room ' + barcode,
            template: 'Please, try again!'
          });
          $timeout(function () {
            $ionicLoading.hide();
            alertPopup.close();
            // uploadingPopup.close();
          }, 1000);
        }
        //alert('We got a barcoden - Result: '+$scope.inbarcode);
      })
  };
  $scope.loadFunction();

  $scope.get_more = function () {
    $scope.hasData = 1;
    if (pageIndex > 0) {
      $scope.today_DT = convert_DT(new Date());
      // $ionicLoading.show();
      $scope.myPromise = $http.get(HOSTNAME + "/mob_page_scanforWorkorder?barcode=" + barcode + "&empkey=" + $scope.toServeremployeekey + "&ondate=" + $scope.today_DT + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)
        .success(function (response) {
          if (response.length > 0) {
            response.forEach(function (data) {
              if (data.WorkorderTypeKey == - 1) {
                data.FloorName = "Refer Notes";
                data.ZoneName = "Refer Notes";
                data.RoomId = "Refer Notes";
              }
            })
            $scope.viewworkorder = $scope.viewworkorder.concat(response);
            pageIndex = pageIndex + 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
          else {
            $scope.hasData = 0;
          }
        });
    }
    else {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  };

  $scope.updateSlideStatus = function () {
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
  // $scope.imageSrc = 'http://ionicframework.com/img/ionic-logo-blog.png';



  $scope.scrollToTop();
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

  document.addEventListener("backbutton", function () {
    // pass exitApp as callbacks to the switchOff method
    window.plugins.flashlight.switchOff();
  }, false);
});


