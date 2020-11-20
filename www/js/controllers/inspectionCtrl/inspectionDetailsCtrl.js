//controller for view all workorder ->manager
myApp.controller('inspectionDetailsCtrl', function (HOSTNAME, $ionicPopup, $ionicLoading, $scope, $stateParams, $filter, $window, $ionicScrollDelegate, $state, $timeout, $http, $rootScope) {
  //       //$scope.vwok = [];
  // $scope.empKey = window.localStorage.getItem('employeeKey');
  $scope.serverLocation = HOSTNAME;
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  // alert(empKey);
  $scope.getBackgroundGeolocation($scope.toServeremployeekey);
  // console.log("INSIDE workorderDetailsCtrl");
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
  $scope.inspectionNotCompleted = true;
  var inspectionorder_key = $stateParams.inspectionorderkey;
  console.log("inside details " + inspectionorder_key);
  // $ionicLoading.hide();
  if (inspectionorder_key) {
    // $ionicLoading.show();
    $scope.myPromise = $http.get($scope.serverLocation + "/getinspectionDetails?inspectionorder=" + inspectionorder_key + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        $scope.scrollToTop();
        // $ionicLoading.hide();
        // debugger;
        if (response[0].InspectionCompletedBy === null) {
          $scope.inspectionNotCompleted = true;
        }
        else {
          $scope.inspectionNotCompleted = false;
          $scope.inspectionDetails = response;
          $scope.roomtype = $scope.inspectionDetails[0].RoomType;
          $scope.supervisorName = $scope.inspectionDetails[0].SupervisorName;
          $scope.templateName = $scope.inspectionDetails[0].TemplateName;
          $scope.scoreName = $scope.inspectionDetails[0].ScoreName;
          $scope.roomId = $scope.inspectionDetails[0].RoomId;
          $scope.inspectionreport = "Inspection Report";
          $scope.inspectedby = "Inspected By: "
          $scope.scoreType = "Score Name: "
          $scope.values = "Value: ";
          $scope.notes = "Notes: ";
          $scope.Observationdef = "Observation/Deficiency: ";
          $scope.Correctiveaction = "Corrective Action: ";
          $scope.Completeddate = "Completed Date: ";
        }

        // console.log($scope.inspectionDetails);
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
  } else {
    $state.go('managerDashboard.inspectionorderProvided');
  }

  $scope.getWorkorderDetails = function () {
    $scope.myPromise = $http.get($scope.serverLocation + "/getinspectionDetails?inspectionorder=" + inspectionorder_key + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        $scope.scrollToTop();
        $scope.inspectionDetails = response;
        // console.log($scope.inspectionDetails);
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
