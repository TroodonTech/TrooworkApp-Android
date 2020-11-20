//controller for view all workorder ->manager
myApp.controller('workorderFilteringByFacilityViewCtrl', function (HOSTNAME, $scope, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicActionSheet, $ionicPlatform, $ionicModal, $ionicLoading, $stateParams) {
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  // alert(empKey);
  // console.log("INSIDE WorkOrderFilteringByFacilityCtrl");
  $scope.getBackgroundGeolocation($scope.toServeremployeekey);

  $scope.scrollMainToTop = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };
  $scope.scrollSmallToTop = function () {
    $ionicScrollDelegate.$getByHandle('small').scrollTop();
  };
  $scope.active = 'facilityFilter';
  $scope.setActive = function (type) {
    $scope.active = type;
  };
  $scope.isActive = function (type) {
    return type === $scope.active;
  };
  $scope.showDatepicker = false;


  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function (group) {
    $rootScope.sel_group = group;
    $scope.ButtonValue = "facility";
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
    console.log("inside toggleGroup " + $rootScope.sel_group.FacilityKey);
  };


  var facilitykey = $stateParams.facilitykey;
  var zonekey = $stateParams.zonekey;
  var floorkey = $stateParams.floorkey;

  var pageIndex = 0;
  $scope.hasData = 1;

  $scope.loadFunction = function () {
    $scope.hasData = 1;
    pageIndex = 0;
    // alert(facilitykey+" "+zonekey+" "+ floorkey);
    $scope.today_DT = convert_DT(new Date());
    // $ionicLoading.show();
    $scope.myPromise = $http.get(HOSTNAME + "/mob_page_viewworkorderFilterByFacility?facilitykey=" + facilitykey + "&zone=" + zonekey + "&floor=" + floorkey + "&today=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)
      .success(function (response) {
        // $ionicLoading.hide();
        // debugger;
        if (response.length > 0) {
          $scope.scrollToTop();
          response.forEach(function (data) {
            if (data.WorkorderTypeKey == - 1) {
              data.FloorName = "Refer Notes";
              data.ZoneName = "Refer Notes";
              data.RoomId = "Refer Notes";
            }
          })
          $scope.viewworkorder = response;
          pageIndex = pageIndex + 1;
          // console.log($scope.viewworkorder);
        }
        else {
          $scope.hasData = 0;
          $scope.scrollToTop();
          $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
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
  };

  $scope.loadFunction();
  $scope.get_more = function () {
    $scope.hasData = 1;
    if (pageIndex > 0) {
      $scope.today_DT = convert_DT(new Date());
      // $ionicLoading.show();
      $scope.myPromise = $http.get(HOSTNAME + "/mob_page_viewworkorderFilterByFacility?facilitykey=" + facilitykey + "&zone=" + zonekey + "&floor=" + floorkey + "&today=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)
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
});
