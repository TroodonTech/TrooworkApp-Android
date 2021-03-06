myApp.controller('schedulerDatePickerCtrl', function (HOSTNAME, $ionicPopup, $ionicPlatform, ionicDatePicker, $ionicLoading, $scope, $stateParams, $filter, $window, $ionicScrollDelegate, $state, $timeout, $http, $rootScope) {
  $scope.serverLocation = HOSTNAME;
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  $scope.getBackgroundGeolocation($scope.toServeremployeekey);

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
    var moveData = $ionicScrollDelegate.getScrollPosition().top;
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

  function convert_DT_calendar(str) {
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

  if ($rootScope.globalDateValue) {
    $scope.dateValue = $rootScope.globalDateValue;
  } else {
    $scope.dateValue = convert_DT_calendar(new Date());
  }
  // $scope.loadAllData = function () {
  //   console.log("Inside loadAllData() ");
  //   console.log("Inside loadAllData() " + $scope.dateValue);

  // };
  // $scope.saveEvent = function () {
  //   console.log("I am going back");
  //   DayPilot.Modal.close();

  // };


  var dtRange = "Week";
  var groupName = "Manager";

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
    if ($rootScope.globalDateValue) {
      $scope.dateValue = $rootScope.globalDateValue;
    } else {
      $scope.dateValue = convert_DT_calendar(new Date());
    }
    console.log("schedulerctrl date onint " + $scope.dateValue);


    $scope.myPromise = $http.get($scope.serverLocation + "/allemployees_SuType?empkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        $scope.empList = response;
        $scope.empKeys = [];

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

    var dp1 = new DayPilot.Scheduler("dp1", {
      theme: "dark",
      timeHeaders: [{ "groupBy": "Month" }, { "groupBy": "Day", "format": "d" }],
      eventHeight: 30,
      scale: "Day",
      days: 07,
      cellWidth: 130,
      //      infiniteScrollingEnabled: true,
      //      infiniteScrollingMargin: 200,
      //      infiniteScrollingStepDays: 70,
      startDate: $scope.dateValue,
      timeRangeSelectedHandling: "Enabled",
      // onTimeRangeSelected: function (args) {
      //   var dp1 = this;
      //   DayPilot.Modal.prompt("Create a new event:", "Event 1").then(function (modal) {
      //     dp1.clearSelection();
      //     if (!modal.result) { return; }
      //     dp1.events.add(new DayPilot.Event({
      //       start: args.start,
      //       end: args.end,
      //       id: DayPilot.guid(),
      //       resource: args.resource,
      //       text: modal.result
      //     }));
      //   });
      // },
      // bubble: new DayPilot.Bubble({
      //   onLoad: function (args) {
      //     var e = args.source;
      //     args.html = "Event details: " + e.data.id;
      //   }
      // }),
      onBeforeEventRender: function (args) {
        args.data.areas = [
          // { left: 2, top: 5, bottom: 5, width: 20, icon: "icon icon-resize-left", action: "ResizeStart" },
          // { right: 2, top: 5, bottom: 5, width: 20, icon: "icon icon-resize-right", action: "ResizeEnd" },
          // { left: 22, top: 5, bottom: 5, width: 20, icon: "icon icon-move", action: "Move" },
          // { right: 54, top: 5, bottom: 5, width: 32, icon: "icon icon-info", action: "Bubble" },
          { right: 5, top: 5, bottom: 5, width: 32, icon: "icon icon-menu", action: "ContextMenu" },
          { left: 5, top: 5, bottom: 5, right: 84, style: "display: flex; align-items: center;", html: args.data.text },
          // word-wrap: break-word
        ];
        args.data.html = '';
      },
      contextMenu: new DayPilot.Menu({
        items: [
          { text: "Details", onClick: function (args) { var e = args.source; DayPilot.Modal.alert(e.text()); } },
          //           {
          //             text: "Create", onClick: function (args) {
          ////             var data=$scope.assignmentList;
          ////             var form=[{name: "Event Name", id: "assignmentKey",options}];
          //var form = [
          //  {name: "First Name", id: "first"},
          //  {name: "Last Name", id: "last"}
          //];
          //
          //var data = {
          //  first: "Jane",
          //  last: "Doe",
          //  id: 1204
          //};
          //            DayPilot.Modal.form(form,data).then(function(args) {
          //              if (!args.canceled) {
          //                console.log("data", args.result);    //  {first: "John", last: "Doe"}
          //              }
          //            });
          ////               var modal = new DayPilot.Modal({
          ////                 saveEvent: function (args) {
          ////                   console.log("Modal dialog closing");
          ////                   modal.close();
          ////                 },
          ////                 onClosed: function (args) {
          ////                   console.log("Modal dialog closed");
          ////                 },
          ////                 // ...
          ////               });
          ////               modal.showHtml("<div><h1>Create Event</h1><form><div><select ng-model='assignmentKey' ng-options='x.ScheduleName for x in assignmentList | unique:'ScheduleName'' ng-value='x.BatchScheduleNameKey'><option label=' Select '></option></select></div><div><button click='saveEvent()'>Save</button><button click='onClosed()'>Cancel</button></div></form></div>");
          //             }
          //           },
          //           { text: "Delete", onClick: function (args) { dp1.events.remove(args.source); } },
        ]
      })
    });

    // dp1.resources = [
    //   { name: "Person 1", id: "R1" },
    //   { name: "Person 2", id: "R2" },
    //   { name: "Person 3", id: "R3" },
    //   { name: "Person 4", id: "R4" },
    //   { name: "Person 5", id: "R5" },
    //   { name: "Room 1", id: "R6" },
    //   { name: "Room 2", id: "R7" },
    //   { name: "Room 3", id: "R8" },
    //   { name: "Room 4", id: "R9" },
    // ];
    // dp1.events.list = [
    //   {
    //     id: 1,
    //     start: "2021-01-05T00:00:00",
    //     end: "2021-01-15T00:00:00",
    //     resource: "R2",
    //     text: "Event 1"
    //   }
    // ];
    $scope.myPromise = $http.get($scope.serverLocation + "/employeeCalendarDetailsForScheduler_mob?dateRange=" + dtRange + "&startDate=" + $scope.dateValue + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response1) {
        console.log("Events length:..." + response1.length);
        // dp1.events.list = response1;
        response1.forEach(el => {
          dp1.events.add(el);
        });
        // console.log("Event check: " + dp1.events.list);
        // dp1.update();
      })
      .error(function (error) {
        var alertPopup = $ionicPopup.alert({
          title: 'Something went Wrong',
          template: 'Please relogin!'
        });
        $timeout(function () {
          $ionicLoading.hide();
          alertPopup.close();
        }, 1000);
      });
    $scope.myPromise = $http.get($scope.serverLocation + "/employeesForScheduler_SuType_mob?groupID=" + groupName + "&empkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        dp1.update(dp1.resources = response);
        console.log("employees length:..." + response.length);
      })
      .error(function (error) {
        var alertPopup = $ionicPopup.alert({
          title: 'Something went Wrong',
          template: 'Please relogin!'
        });
        $timeout(function () {
          $ionicLoading.hide();
          alertPopup.close();
        }, 1000);
      });
    dp1.autoScroll = "Always";
    //dp1.dynamicLoading = true;
    //dp1.rowHeaderScrolling = true;
    dp1.scrollLabelsVisible = true;
    //dp1.infiniteScrollingEnabled = true;
    dp1.init();
    // $scope.loadAllData();

    var empKey1;
    $scope.selectedEmployees = function (EmployeeKey1) {
      console.log(EmployeeKey1);
      empKey1 = EmployeeKey1.map(x => x.EmployeeKey).join();
      console.log(empKey1);
      $scope.myPromise = $http.get($scope.serverLocation + "/employeesrowFiltering_mob?groupID=" + groupName + "&searchtext=" + empKey1 + "&range=" + dtRange + "&todaydate=" + $scope.dateValue + "&OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
          dp1.update(dp1.resources = response);
          console.log("employees length fn:..." + response.length);
        })
        .error(function (error) {
          var alertPopup = $ionicPopup.alert({
            title: 'Something went Wrong',
            template: 'Please relogin!'
          });
          $timeout(function () {
            $ionicLoading.hide();
            alertPopup.close();
          }, 1000);
        });
    };
  });

  var ipObj2 = {
    callback: function (val) {  //Mandatory
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.dateValue = convert_DT(new Date(val));
      console.log("New Date is " + $scope.dateValue);
      $rootScope.globalDateValue = $scope.dateValue;

      console.log($rootScope.globalDateValue + "  schedulerctrl callback " + $scope.dateValue);
      $state.go("managerDashboard.scheduler");
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


});
