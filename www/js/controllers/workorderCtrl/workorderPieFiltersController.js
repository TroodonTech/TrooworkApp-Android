//controller for pie chart report
myApp.controller('workorderPieFiltersController', function (HOSTNAME, $scope, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicActionSheet, $ionicPlatform, $ionicModal, $ionicLoading, ionicDatePicker) {
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  // alert(empKey);
  console.log("INSIDE pie chart controller");
  $scope.getBackgroundGeolocation($scope.toServeremployeekey);
  $scope.serverLocation = HOSTNAME;
  $rootScope.toServeremployeekey = $scope.toServeremployeekey;
  $scope.scrollMainToTop = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };
  $scope.scrollSmallToTop = function () {
    $ionicScrollDelegate.$getByHandle('small').scrollTop();
  };

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
  function convert_DT(str) {// reduce one day for display
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  //$scope.dateValue = convert_DT(new Date());
  $scope.timeValue = new Date().getHours() + ':' + new Date().getMinutes();


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


  $scope.serverLocation = HOSTNAME;
  $scope.todayDT = convert_DT(new Date());
  $scope.dateValue = $scope.todayDT;
  $scope.dateValue1 = $scope.todayDT;
  $scope.viewworkorder = {};
  // loading the dropdowns for filter starts....
  $http.get($scope.serverLocation + "/mob_allemployees?empkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID).success(function (response) {
    $scope.viewworkorder.workorderemployeeList = response;
  });

  $http.get($scope.serverLocation + "/mob_allWorkordertype?empkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID).success(function (response) {
    $scope.viewworkorder.workordertypelist = response;
  });


  // loading the dropdowns for filter ends....
  $scope.generateFilterPieChart = function () {

    var search_DT = ($scope.dateValue) ? convert_DT($scope.dateValue) : $scope.todayDT;
    var search_DT2 = ($scope.dateValue1) ? convert_DT($scope.dateValue1) : search_DT;
    if (search_DT > search_DT2) {
      //            debugger;
      $scope.dateValue1 = null;
      var alertPopup = $ionicPopup.alert({
        title: 'Please check your Start Date!'
      });
      $timeout(function () {
        $ionicLoading.hide();
        alertPopup.close();
        // uploadingPopup.close();
      }, 1000);
      //                })
      //        $scope.clickToOpen("");
      search_DT2 = search_DT;
      return;
    }

    $rootScope.EmployeeKey = $scope.viewworkorder.EmployeeKey;
    $rootScope.WorkorderTypeKey = $scope.viewworkorder.WorkorderTypeKey;
    $rootScope.fromDate = search_DT;
    $rootScope.toDate = search_DT2;
    $rootScope.isFiltered = 1;

    $state.go('managerDashboard.workorder_pie');
  }
  /*
  Date Picker starts here.....
  */
  var ipObj1 = {
    callback: function (val) {  //Mandatory
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.dateValue1 = convert_DT(new Date(val));
      //        $scope.workorderCreation.workorderDate = convert_DT_addOneDay(new Date(val));
    },
    disabledDates: [            //Optional
      new Date(2016, 2, 16),
      new Date(2015, 3, 16),
      new Date(2015, 4, 16),
      new Date(2015, 5, 16),
      new Date('Wednesday, August 12, 2015'),
      new Date("08-16-2016"),
      new Date(1439676000000)
    ],
    from: new Date(2012, 1, 1), //Optional
    // to: new Date(2024, 10, 30), //Optional
    inputDate: new Date(),      //Optional
    mondayFirst: true,          //Optional
    disableWeekdays: [],       //Optional
    closeOnSelect: false,       //Optional
    templateType: 'popup',
    setLabel: 'Save'      //Optional
  };

  var ipObj2 = {
    callback: function (val) {  //Mandatory
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.dateValue = convert_DT(new Date(val));
      //        $scope.workorderCreation.workorderDate = convert_DT_addOneDay(new Date(val));
    },
    disabledDates: [            //Optional
      new Date(2016, 2, 16),
      new Date(2015, 3, 16),
      new Date(2015, 4, 16),
      new Date(2015, 5, 16),
      new Date('Wednesday, August 12, 2015'),
      new Date("08-16-2016"),
      new Date(1439676000000)
    ],
    from: new Date(2012, 1, 1), //Optional
    // to: new Date(2024, 10, 30), //Optional
    inputDate: new Date(),      //Optional
    mondayFirst: true,          //Optional
    disableWeekdays: [],       //Optional
    closeOnSelect: false,       //Optional
    templateType: 'popup',
    setLabel: 'Save'      //Optional
  };

  $scope.openDatePicker = function () {
    ionicDatePicker.openDatePicker(ipObj2);
  };
  $scope.openDatePicker1 = function () {
    ionicDatePicker.openDatePicker(ipObj1);
  };

  /*
  Date Picker ends here.....
  */
});
