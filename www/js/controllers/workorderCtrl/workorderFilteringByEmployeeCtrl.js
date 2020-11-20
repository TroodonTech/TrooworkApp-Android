//controller for view all workorder ->manager
myApp.controller('workorderFilteringByEmployeeCtrl', function (HOSTNAME, $scope, $filter, $ionicLoading, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicPlatform, $ionicModal, ionicDatePicker) {
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  // alert(empKey);
  $scope.getBackgroundGeolocation($scope.toServeremployeekey);
  // console.log("INSIDE workorderFilteringByEmployeeCtrl");
  $scope.scrollMainToTop = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };
  $scope.scrollSmallToTop = function () {
    $ionicScrollDelegate.$getByHandle('small').scrollTop();
  };
  // for filter button group
  $scope.active = 'employeeFilter';
  $scope.setActive = function (type) {
    $scope.active = type;
  };
  $scope.isActive = function (type) {
    return type === $scope.active;
  };
  $scope.toggleGroup = function (group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
    $scope.today_DT = convert_DT(new Date());
    // alert("called"+group.EmployeeKey+".."+$scope.today_DT);
    // $scope.myPromise = $http.get(HOSTNAME+ "/getStatusListByEmployeeKey?today_date=" + $scope.today_DT+"&employeekey="+group.EmployeeKey)
    $scope.myPromise = $http.get(HOSTNAME + "/getStatusListByEmployeeKey?today_date=" + $scope.today_DT + "&employeekey=" + group.EmployeeKey + "&userKey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)//  status /roomtype  /employee
      .success(function (response) {
        $scope.scrollToTop();
        // debugger;
        $scope.workorderStatusList = response;
        console.log($scope.workorderStatusList);
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
  };

  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };
  $rootScope.toServeremployeekey = profile.employeekey;
  $scope.getAllEmployee = function () {
    $scope.active = 'employeeFilter';
    $scope.showFacilityAccordion = true;
    // $ionicLoading.show();
    $scope.myPromise = $http.get(HOSTNAME + "/mob_allemployees?empkey=" + $rootScope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        // $ionicLoading.hide();
        $scope.employeeList = response;
        // console.log($scope.employeeListSupervisorView);
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

  };
  $scope.getAllEmployee();


  $scope.getWorkorderByStatusEmployeeKey = function (employeekey, workstatuskey) {
//    $scope.showFacilityAccordion = false;
//    $scope.today_DT = convert_DT(new Date());


    //              $state.go('managerDashboard.scanworkorder', { barcode: $scope.inbarcode });
    if (profile.role == 'Supervisor') {
      $state.go('supervisorDashboard.filteringByEmployeeListView', { employeekey: employeekey, workstatuskey: workstatuskey });
    }
    else if (profile.role == 'Employee') {
      $state.go('employeeDashboard.filteringByEmployeeListView', { employeekey: employeekey, workstatuskey: workstatuskey });
    }
    else if (profile.role == 'Manager') {
      $state.go('managerDashboard.filteringByEmployeeListView', { employeekey: employeekey, workstatuskey: workstatuskey });
    }

    //    // $ionicLoading.show();
    //    $scope.myPromise = $http.get(HOSTNAME + "/getWorkorderByStatusEmployeeKey_Ang6?employeekey=" + employeekey + "&workstatuskey=" + workstatuskey + "&today=" + $scope.today_DT + "&userKey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)//  status /roomtype  /employee
    //      .success(function (response) {
    //        $scope.scrollToTop();
    //        // $ionicLoading.hide();
    //
    //        // console.log('length*****' + response.length);
    //        if (parseInt(response.length) > 0) {
    //          response.forEach(function (data) {
    //            if (data.WorkorderTypeKey == - 1) {
    //              data.FloorName = "Refer Notes";
    //              data.ZoneName = "Refer Notes";
    //              data.RoomId = "Refer Notes";
    //            }
    //          })
    //          $scope.viewworkorder = response;
    //
    //        }
    //        else {
    //          $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
    //          //  [{"WorkorderTypeName":"No works found!"}];
    //          //
    //        }
    //
    //      })
    //      .error(function (error) {
    //        var alertPopup = $ionicPopup.alert({
    //          title: 'Something went Wrong',
    //          template: 'Please relogin!'
    //        });
    //        $timeout(function () {
    //          $ionicLoading.hide();
    //          alertPopup.close();
    //          // uploadingPopup.close();
    //        }, 1000);
    //      });
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
  function convertDateFormat(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("/");
  }
});
