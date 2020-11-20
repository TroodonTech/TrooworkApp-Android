//controller for pie chart report
myApp.controller('workorderPieController', function (HOSTNAME, $scope, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicActionSheet, $ionicPlatform, $ionicModal, $ionicLoading, ionicDatePicker, $interval) {
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
  $scope.showPie = false;

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
  $scope.today_DT = convert_DT(new Date());
  $scope.dateValue = $scope.today_DT;
  $scope.dateValue1 = $scope.today_DT;

  //Load pie chart as default when clicking the report button starts ...

  $scope.loadpie = function () {
    console.log("inside loadpie.....");
    $scope.loadingStatus = $http.get($scope.serverLocation + "/valuesForPie?date=" + $scope.dateValue + "&empkey=" + $scope.toServeremployeekey + "&userkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID).success(function (response) {
      //         valuesForPieService.valuesForPie($scope.today_DT ,$scope.toServeremployeekey ,$scope.toServeremployeekey,$scope.OrganizationID)
      $scope.StatusName = response;

      //                        for (var i = 0; i < $scope.StatusName.length; i++) {
      //                                        console.log("******************   WorkorderStatus ...   "+$scope.StatusName[i].WorkorderStatus+" total "+$scope.StatusName[i].totalItems);
      //                                    }

      var k = 0;
      for (var i = 0; i < $scope.StatusName.length; i++) {
        if ($scope.StatusName[i].totalItems == 0) {
          k++;
        }
      }
      if (k == $scope.StatusName.length) {
        $scope.showPie = true;
      } else {
        $scope.showPie = false;

        $timeout(function () {
          google.charts.load('current', { 'packages': ['corechart'] });
          google.charts.setOnLoadCallback(drawChart);

          // Draw the chart and set the chart values
          function drawChart() {
            //           debugger;
            console.log("inside draw chart");
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'workordertype');
            data.addColumn('number', 'count');
            for (var i = 0; i < $scope.StatusName.length; i++) {
              data.addRow([$scope.StatusName[i].WorkorderStatus, $scope.StatusName[i].totalItems]);
            }
            //console.log(".... "+data.length+"................");
            //              for (var i = 0; i < data.length; i++) {
            //                                                      console.log("******************   workordertype ...   "+data[i].workordertype+" count "+data[i].count);
            //                                                  }
            // Optional; add a title and set the width and height of the chart
            var options = { 'title': 'Workorder', 'width': 300, 'height': 300, 'backgroundColor': 'transparent', 'is3D': true, 'colors': ['#ef0404', '#3552e0', '#9823a3', '#f9f502', '#0ab223', '#efab34'], legend: { position: 'bottom', alignment: 'end', textStyle: { fontSize: 11 } }, 'chartArea': { 'width': '100%', 'height': '80%' } };

            // Display the chart inside the <div> element with id="piechart"
            var chart = new google.visualization.PieChart(document.getElementById('piechart'));

            chart.draw(data, options);

          }
        }, 10)
      }
    });
  }

  //Load pie chart as default when clicking the report button ends ...

  // Pie chart with filter starts....
  $scope.filterKeys = {};
  $scope.loadFilterPie = function () {
    console.log("inside loadFilterPie ****************** ");
    if ($rootScope.fromDate) {
      $scope.filterKeys.workorderDate = $rootScope.fromDate;
    } else {
      $scope.filterKeys.workorderDate = $scope.today_DT;;
    }

    if ($rootScope.toDate) {
      $scope.filterKeys.workorderDate2 = $rootScope.toDate;
    } else {
      $scope.filterKeys.workorderDate2 = $scope.filterKeys.workorderDate;
    }

    if ($rootScope.EmployeeKey) {
      $scope.filterKeys.employeeKey = $rootScope.EmployeeKey;
    } else {
      $scope.filterKeys.employeeKey = null;
    }

    if ($rootScope.WorkorderTypeKey) {
      $scope.filterKeys.workorderTypeKey = $rootScope.WorkorderTypeKey;
    } else {
      $scope.filterKeys.workorderTypeKey = null;
    }

    $scope.filterKeys.OrganizationID = $scope.OrganizationID;
    $scope.callchart = function () {
      console.log("inside callchart() ...." + $scope.showPie);
      $scope.loadingStatus = $http.post($scope.serverLocation + "/workorderByfilterPie", $scope.filterKeys).success(function (response) {
        console.log("response.length ****************** " + response.length);
        if (response.message == "Failed to authenticate token.") {
          $rootScope.clickToOpen1("Please Re-Login to continue !");
        }
        $scope.StatusNameEmp = response;
        $scope.EmpName = response[0].empname;
        var k = 0;
        for (var i = 0; i < $scope.StatusNameEmp.length; i++) {
          if ($scope.StatusNameEmp[i].totalItems == 0) {
            k++;
          }
        }
        if (k == $scope.StatusNameEmp.length) {
          $scope.showPie = true;
        } else {
          $scope.showPie = false;

          $timeout(function () {
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            // Draw the chart and set the chart values
            function drawChart() {

              var data = new google.visualization.DataTable();
              data.addColumn('string', 'workordertype');
              data.addColumn('number', 'count');
              for (var i = 0; i < $scope.StatusNameEmp.length; i++) {
                data.addRow([$scope.StatusNameEmp[i].WorkorderStatus, $scope.StatusNameEmp[i].totalItems]);
              }

              // Optional; add a title and set the width and height of the chart
              var options = { 'title': $scope.EmpName, 'width': 300, 'height': 300, 'backgroundColor': 'transparent', 'is3D': true, 'colors': ['#ef0404', '#3552e0', '#9823a3', '#f9f502', '#0ab223', '#efab34'], legend: { position: 'bottom', alignment: 'end', textStyle: { fontSize: 11 } }, 'chartArea': { 'width': '100%', 'height': '80%' } };

              // Display the chart inside the <div> element with id="piechart"
              var chart = new google.visualization.PieChart(document.getElementById('piechart'));
              chart.draw(data, options);
            }
          }, 10)
        }
      });
    }
    console.log($scope.showPie + ".... ****** final");
    $scope.callchart();
    var stop2 = $interval(function () {
      $scope.callchart();
    }, 900000);

    $scope.$on('$destroy', function () {
      $interval.cancel(stop2);
    });
  }
  // Pie chart with filter ends......
  console.log("******************* flag value is  ..... " + $rootScope.isFiltered);
  if ($rootScope.isFiltered == 1) {
    $scope.loadFilterPie();
    $rootScope.isFiltered = undefined;
  }
  else if ($rootScope.isFiltered == undefined) {
    $scope.loadpie();
  }
  /*
  Date Picker starts here.....
  */
  var ipObj1 = {
    callback: function (val) {  //Mandatory
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.dateValue1 = convert_DT(new Date(val));
      $scope.workorderCreation.workorderDate = convert_DT_addOneDay(new Date(val));
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
      $scope.workorderCreation.workorderDate = convert_DT_addOneDay(new Date(val));
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
