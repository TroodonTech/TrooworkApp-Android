//controller for view all workorder ->manager
myApp.controller('workorderFilteringByDateCtrl', function (HOSTNAME, $ionicLoading, $scope, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicPlatform, $ionicModal, ionicDatePicker) {
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  // alert(empKey);
  $scope.getBackgroundGeolocation($scope.toServeremployeekey);
  // console.log("INSIDE workorderFilteringByDateCtrl");
  $scope.scrollMainToTop = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };
  $timeout(function () {
    $ionicLoading.hide();
  }, 4000);
  $scope.scrollSmallToTop = function () {
    $ionicScrollDelegate.$getByHandle('small').scrollTop();
  };
  // for filter button group
  $scope.active = 'dateFilter';
  $scope.setActive = function (type) {
    $scope.active = type;
  };
  $scope.isActive = function (type) {
    return type === $scope.active;
  };
  $scope.today_DT = convert_DT(new Date());
  $scope.myPromise = $http.get(HOSTNAME + "/viewworkorder?viewdate=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
    .success(function (response) {
      // debugger;
      $scope.viewworkorder = response;
      // console.log($scope.viewworkorder);
      // console.log("workorderFilteringByDateCtrl "+$scope.viewworkorder);
    });
  $scope.WorkorderDateFilter = convertDateFormat(new Date());
  $scope.getWorkorderByDateFilter = function () {
    var dateFilter_date = $scope.WorkorderDateFilter;
    // alert(dateFilter_date);
  };

  var ipObj1 = {
    callback: function (val) {  //Mandatory
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
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
    to: new Date(2016, 10, 30), //Optional
    inputDate: new Date(),      //Optional
    mondayFirst: true,          //Optional
    disableWeekdays: [0],       //Optional
    closeOnSelect: false,       //Optional
    templateType: 'popup'       //Optional
  };

  $scope.openDatePicker = function () {
    ionicDatePicker.openDatePicker(ipObj1);
  };

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