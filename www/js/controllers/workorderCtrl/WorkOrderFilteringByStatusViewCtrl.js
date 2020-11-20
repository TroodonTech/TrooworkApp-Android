//controller for view all workorder ->manager
myApp.controller('WorkOrderFilteringByStatusViewCtrl', function (HOSTNAME, $scope, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicPlatform, $ionicModal, $ionicLoading, $stateParams) {
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  $scope.managerRole = profile.role;
  // alert(empKey);
  // console.log("INSIDE WorkOrderFilteringByStatusCtrl");
  if ($scope.toServeremployeekey) {
    console.log($scope.toServeremployeekey);
    $scope.getBackgroundGeolocation($scope.toServeremployeekey);

    $scope.scrollMainToTop = function () {
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    };
    $scope.scrollSmallToTop = function () {
      $ionicScrollDelegate.$getByHandle('small').scrollTop();
    };
    // for filter button group
    $scope.active = 'statusFilter';
    $scope.setActive = function (type) {
      $scope.active = type;
    };
    $scope.isActive = function (type) {
      return type === $scope.active;
    };
    $scope.showDatepicker = false;

    var statuskey = $stateParams.statuskey;

    var pageIndex = 0;
    $scope.hasData = 1;


    $scope.loadFunction = function () {
      $scope.hasData = 1;
      pageIndex = 0;
      // $ionicLoading.show();
      // alert(statuskey);
      $scope.today_DT = convert_DT(new Date());
      $scope.myPromise = $http.get(HOSTNAME + "/mob_page_workorderFilterByStatusEmpView?statuskey=" + statuskey + "&today=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)//  status /roomtype  /employee
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
            $scope.scrollToTop();
            $scope.hasData = 0;
            $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
          }
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

    $scope.loadFunction();
    $scope.get_more = function () {
      $scope.hasData = 1;
      if (pageIndex > 0) {
        $scope.today_DT = convert_DT(new Date());
        // $ionicLoading.show();
        $scope.myPromise = $http.get(HOSTNAME + "/mob_page_workorderFilterByStatusEmpView?statuskey=" + statuskey + "&today=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)//  status /roomtype  /employee
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
    // $scope.getDetailedWorkorder = function(workorderkey){
    //         $rootScope.workorderkey = workorderkey;
    //         // alert($rootScope.workorderkey);
    //         $state.go('employeeDashboard.detailedWorkorderView');
    //    };
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
  }
  else {
    $state.go('login');
  }
});
