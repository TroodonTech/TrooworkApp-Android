//controller for view all workorder ->manager
myApp.controller('WorkOrderFilteringByFacilityCtrl', function (HOSTNAME, $scope, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicActionSheet, $ionicPlatform, $ionicModal, $ionicLoading) {
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
  $scope.getAllFacility = function () {
    $scope.showFloorList = false;
    $scope.filteringByFacility = false;
    $scope.showFacilityAccordion = true;
    // $ionicLoading.show();
    // console.log("$window.sessionStorage.token "+$window.sessionStorage.token);
    //       $http({method: 'GET', url: HOSTNAME + "/allfacility", headers: {
    //     'Authorization':  $window.sessionStorage.token}
    // });

    $scope.myPromise = $http.get(HOSTNAME + "/mob_allfacility?empkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)//  status /roomtype  /employee
      .success(function (response) {
        // $ionicLoading.hide();
        // debugger;
        // alert(" inside http ");
        $scope.facilityList = response;
        $scope.scrollToTop();
        // console.log($scope.facilityList);
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
    $scope.setActive('facilityFilter');
  };
  $scope.getAllFacility();

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
  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };

  $scope.getFloorByFacilityKey = function (facilitykey) {
    // $ionicLoading.show();
    // alert(facilitykey);
    $scope.myPromise = $http.get(HOSTNAME + "/floorByFacility?fkey=" + facilitykey + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        // $ionicLoading.hide();
        // debugger;
        $scope.scrollToTop();
        $scope.zoneByFacilityKeyList = response;
        // console.log($scope.zoneByFacilityKeyList);
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
    console.log("inside getFloorByFacilityKey " + facilitykey);
  };
  $scope.facilityBack = false;
  $scope.backButton = function () {
    console.log("back button clicked " + $scope.ButtonValue);
    if ($scope.ButtonValue == "floor") {
      console.log("inside floor click");
      // $scope.shownGroup = null;
      $scope.facilityBack = false;
      $scope.setActive('facilityFilter');
      $scope.getAllFacility();
      // toggleGroup(group);getFloorByFacilityKey(group.FacilityKey);
    }
    if ($scope.ButtonValue == "zone") {// pass floorkey
      $scope.getZoneByFacilityFloorKey($rootScope.sel_group.FacilityKey, $rootScope.sel_floor, $rootScope.sel_group)
    }

    //  if($scope.showFloorList && $scope.showFacilityAccordion !== true && $scope.filteringByFacility !== true){
    //  console.log("inside zone true condition "+$rootScope.sel_group);
    //     $scope.showFloorList = false;
    //     $scope.filteringByFacility =false;

    //     $scope.getFloorByFacilityKey($rootScope.sel_group.FacilityKey);
    //     $scope.toggleGroup($rootScope.sel_group);

    //    $scope.showFacilityAccordion=true;
    //    if ($scope.isGroupShown($rootScope.sel_group)) {
    //      $scope.shownGroup = null;
    //    } else {
    //      $scope.shownGroup = $rootScope.sel_group;
    //    }
    // // $scope.toggleGroup($rootScope.sel_group);
    //  }
    console.log("inside backButton $rootScope.sel_group" + $rootScope.sel_group);
  };

  $scope.showBackButton = function () {
    $scope.facilityBack = true;
  };

  // $ionicLoading.hide();
  $scope.getZoneByFacilityFloorKey = function (facilitykey, floor_key, group) {
    // $ionicLoading.show();
    // console.log(facilitykey);
    $scope.myPromise = $http.get(HOSTNAME + "/zoneByFacility_Floor?fkey=" + facilitykey + "&floorkey=" + floor_key + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        // $ionicLoading.hide();
        // debugger;
        $rootScope.sel_floor = floor_key;
        $scope.ButtonValue = "floor";
        $scope.scrollToTop();

        $scope.floorListByZoneFacility = response;
        // console.log($scope.floorListByZoneFacility);
        $scope.facilitykey = facilitykey;
        $scope.floor_key = floor_key;
        $scope.showFloorList = true;
        $scope.filteringByFacility = false;
        $scope.showFacilityAccordion = false;

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
  $scope.getAllWorkorderByFacilityFloorZone = function (facilitykey, zonekey, floorkey) {

   if (profile.role == 'Supervisor') {
        $state.go('supervisorDashboard.filteringByFacilityView', { facilitykey: facilitykey, floorkey: floorkey, zonekey: zonekey });
      }
      else if (profile.role == 'Employee') {
        $state.go('employeeDashboard.filteringByFacilityView', { facilitykey: facilitykey, floorkey: floorkey, zonekey: zonekey });
      }
      else if (profile.role == 'Manager') {
        $state.go('managerDashboard.filteringByFacilityView', { facilitykey: facilitykey, floorkey: floorkey, zonekey: zonekey });
      }


//
//    // alert(facilitykey+" "+zonekey+" "+ floorkey);
//    $scope.today_DT = convert_DT(new Date());
//    // $ionicLoading.show();
//    $scope.myPromise = $http.get(HOSTNAME + "/viewworkorderFilterByFacility_Ang6?facilitykey=" + facilitykey + "&zone=" + zonekey + "&floor=" + floorkey + "&today=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
//      .success(function (response) {
//        // $ionicLoading.hide();
//        // debugger;
//        $rootScope.sel_zone = zonekey;
//        $scope.ButtonValue = "zone";
//        if (response.length > 0) {
//          $scope.scrollToTop();
//          response.forEach(function (data) {
//            if (data.WorkorderTypeKey == - 1) {
//              data.FloorName = "Refer Notes";
//              data.ZoneName = "Refer Notes";
//              data.RoomId = "Refer Notes";
//            }
//          })
//          $scope.viewworkorder = response;
//          // console.log($scope.viewworkorder);
//        }
//        else {
//          $scope.scrollToTop();
//          $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
//        }
//      })
//      .error(function (error) {
//        var errorPopup = $ionicPopup.alert({
//          title: 'Something went Wrong',
//          template: 'Please relogin!'
//        });
//        $timeout(function () {
//          $ionicLoading.hide();
//          errorPopup.close();
//          // uploadingPopup.close();
//        }, 1000);
//      });
//    $scope.showFloorList = false;
//    $scope.filteringByFacility = true;
//    $scope.showFacilityAccordion = false;
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
