//controller for view all workorder ->manager
myApp.controller('quickWorkorderController', function (HOSTNAME, $scope, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicActionSheet, $ionicPlatform, $ionicModal, $ionicLoading) {
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  // alert(empKey);
  console.log("INSIDE quickWorkorderController");
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


  $scope.newworkorder = {};
  $scope.serverLocation = HOSTNAME;

  console.log("starting promises allfacility");

  $scope.myPromise = $http.get($scope.serverLocation + "/mob_allfacility?empkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
    .success(function (response) {
      $scope.facilityList = response;
      console.log(JSON.stringify(response));
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

  console.log("starting promises allpriority");
  $scope.myPromise = $http.get($scope.serverLocation + "/mob_allpriority?OrganizationID=" + $scope.OrganizationID)
    .success(function (response) {
      $scope.allPriorityList = response;
      // console.log(JSON.stringify(response));
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

  console.log("starting promises allemployees");

  $scope.myPromise = $http.get(HOSTNAME + "/mob_allemployees?empkey=" + $rootScope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
    .success(function (response) {
      // $ionicLoading.hide();
      $scope.allEmployeeList = response;
      console.log($scope.allEmployeeList);
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


  $scope.newWorkordersave = function () {

    console.log("inside quick workorder save ");
    $scope.createworkorder = {};
    var emp_key;
    var notes;
    var facility;
    var priority;
    var isPhotoRequired;
    var wot = - 1; // default.                
    var startDT; //default today's date.
    var workTime; //default current time.
    startDT = convert_DT(new Date());
    console.log("inside quick workorder startDT " + startDT);
    //                workTime = to24Hour(new Date());
    var d = new Date();
    console.log("inside quick workorder d " + d);
    // d is "Sun Oct 13 2013 20:32:01 GMT+0530 (India Standard Time)"
    var datetext = d.toTimeString();
    // datestring is "20:32:01 GMT+0530 (India Standard Time)"
    // Split with ' ' and we get: ["20:32:01", "GMT+0530", "(India", "Standard", "Time)"]
    // Take the first value from array :)
    console.log("inside quick workorder datetext " + datetext);
    datetext = datetext.split(' ')[0];
    workTime = datetext;
    console.log("inside quick workorder workTime " + workTime);

    var isBarcodeRequired = 0;

    if ($scope.newworkorder.EmployeeKey) {
      emp_key = $scope.newworkorder.EmployeeKey.EmployeeKey;
    } else {
      emp_key = -1;
      //  var alertPopup = $ionicPopup.alert({
      //          title: 'Quick Workorder Creation',
      //          template: 'Employee is not provided!'
      //                                    });
      // return;
      var alertPopup = $ionicPopup.alert({
        title: 'Quick Workorder Creation',
        template: 'Employee is not provided!'
      });
      return;
    }
    console.log("inside quick workorder emp key  " + emp_key);
    if ($scope.newworkorder.WorkorderNotes) {
      notes = $scope.newworkorder.WorkorderNotes;
    } else {
      notes = null;
      var alertPopup = $ionicPopup.alert({
        title: 'Quick Workorder Creation',
        template: 'Work order notes is not provided!'
      });
      return;
    }

    console.log("inside quick workorder notes init " + notes);
    var facilityname = "";
    //                debugger;
    facility = '-1'
    if ($scope.newworkorder.FacilityKey) {
      facility = $scope.newworkorder.FacilityKey.FacilityKey;
      var facilitylist = $scope.facilityList;
      facilitylist.forEach(function (data) {
        if (data.FacilityKey == $scope.newworkorder.FacilityKey.FacilityKey) {
          facilityname = data.FacilityText;
        }
      })
      notes = "" + notes + " in " + facilityname;
    } else {
      notes = notes;
      var alertPopup = $ionicPopup.alert({
        title: 'Quick Workorder Creation',
        template: 'Facility is not provided!'
      });
      return;
    }

    console.log("inside quick workorder fac and note  " + facility + "  " + notes);


    if ($scope.newworkorder.PriorityKey) {
      priority = $scope.newworkorder.PriorityKey.PriorityKey;
    } else {
      priority = - 1;
    }
    console.log("inside quick workorder prio" + priority);


    if ($scope.newworkorder.isPhotoRequired) {
      isPhotoRequired = 1;
    } else {
      isPhotoRequired = 0;
    }
    console.log("inside quick workorder photo" + isPhotoRequired);
    console.log("17 Parameters are >>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    $scope.createworkorder.workorderkey = - 99;
    $scope.createworkorder.workordertypekey = - 1;
    $scope.createworkorder.equipmentkey = - 1;
    $scope.createworkorder.roomkeys = '-1';
    $scope.createworkorder.facilitykeys = facility;
    $scope.createworkorder.floorkeys = '-1';
    $scope.createworkorder.zonekeys = '-1';
    $scope.createworkorder.roomtypekeys = '-1';
    $scope.createworkorder.employeekey = emp_key;
    $scope.createworkorder.priority = priority;
    $scope.createworkorder.fromdate = startDT;
    $scope.createworkorder.todate = startDT;
    $scope.createworkorder.intervaltype = '0';
    $scope.createworkorder.repeatinterval = 1;
    $scope.createworkorder.occursonday = null;
    $scope.createworkorder.occursontime = workTime;
    $scope.createworkorder.occurstype = null;
    $scope.createworkorder.workordernote = notes;
    $scope.createworkorder.isbar = isBarcodeRequired;
    $scope.createworkorder.isphoto = isPhotoRequired;
    $scope.createworkorder.metaupdatedby = $scope.toServeremployeekey;
    $scope.createworkorder.OrganizationID = $scope.OrganizationID;
    $timeout(function () {
      console.log("createworkorder " + $scope.createworkorder);
      console.log("17 Parameters are >>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log("workorderkey " + $scope.createworkorder.workorderkey);
      console.log("workordertypekey " + $scope.createworkorder.workordertypekey);
      console.log("equipmentkey " + $scope.createworkorder.equipmentkey);
      console.log("roomkeys " + $scope.createworkorder.roomkeys);
      console.log("facility " + $scope.createworkorder.facilitykeys);
      console.log("floorkeys " + $scope.createworkorder.floorkeys);
      console.log("zonekeys " + $scope.createworkorder.zonekeys);
      console.log("zonekeys " + $scope.createworkorder.roomtypekeys);
      console.log("employeekey " + $scope.createworkorder.employeekey);
      console.log("priority " + $scope.createworkorder.priority);
      console.log("fromdate " + $scope.createworkorder.fromdate);
      console.log("todate " + $scope.createworkorder.todate);
      console.log("intervaltype " + $scope.createworkorder.intervaltype);
      console.log("repeatinterval " + $scope.createworkorder.repeatinterval);
      console.log("occursonday " + $scope.createworkorder.occursonday);
      console.log("occursontime " + $scope.createworkorder.occursontime);
      console.log("occurstype " + $scope.createworkorder.occurstype);
      console.log("workordernote " + $scope.createworkorder.workordernote);
      console.log("isbar " + $scope.createworkorder.isbar);
      console.log("isphoto " + $scope.createworkorder.isphoto);
      console.log("createworkorder " + $scope.createworkorder);
    }, 10);
    $scope.myPromise = $http.post(HOSTNAME + "/addQuickworkorder", $scope.createworkorder)
      .success(function (response) {
        $scope.scrollToTop();
        $scope.newworkorder.WorkorderTypeKey = null;
        $scope.newworkorder.WorkorderNotes = null;
        $scope.newworkorder.RoomKey = null;
        $scope.newworkorder.EmployeeKey = null;
        $scope.newworkorder.PriorityKey = null;
        $scope.newworkorder.WorkorderTime = null;
        $scope.newworkorder.WorkorderStartDate = null;
        $scope.newworkorder.newworkorderError = null;

        $scope.scrollToTop();
        var alertPopup = $ionicPopup.alert({
          title: 'Successfully Added!'
        });
        $timeout(function () {
          $ionicLoading.hide();
          alertPopup.close();
          // uploadingPopup.close();
        }, 1000);
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



});