//controller for view all workorder ->manager
myApp.controller('workorderViewController', function (HOSTNAME, $scope, $filter, $window, $ionicLoading, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicPlatform) {
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  // alert(empKey);
  // console.log("INSIDE WorkOrderViewCtrl");
  $scope.sttButton = false;

  var pageIndex = 0;
  $scope.hasData = 1;

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
  $scope.getBackgroundGeolocation($scope.toServeremployeekey);
  $scope.scrollToTop = function () { //ng-click for back to top button
    $ionicScrollDelegate.scrollTop();
    $scope.sttButton = false;  //hide the button when reached top
  };
  $scope.scrollToTop();
  $scope.scrollMainToTop = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };
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
  $scope.showDatepicker = false;


  $scope.doRefreshEmployeeView = function () {
    $scope.hasData = 1;
    pageIndex = 0;
    $scope.today_DT = convert_DT(new Date());
    // $ionicLoading.show();
    $scope.myPromise = $http.get(HOSTNAME + "/mob_page_viewDashboardWorkorder?viewdate=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)
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
        // $scope.viewworkorder = response;
        // console.log($scope.viewworkorder);
        // console.log(JSON.stringify($scope.viewworkorder));
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
      })
      .finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };
  $scope.doRefreshManagerView = function () {
    $scope.hasData = 1;
    pageIndex = 0;
    $scope.today_DT = convert_DT(new Date());
    // $ionicLoading.show();
    $scope.myPromise = $http.get(HOSTNAME + "/mob_page_viewDashboardWorkorder?viewdate=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)
      .success(function (response) {
        // $ionicLoading.hide();
        // debugger;
        if (response.length > 0) {
          response.forEach(function (data) {
            if (data.WorkorderTypeKey == - 1) {
              data.FloorName = "Refer Notes";
              data.ZoneName = "Refer Notes";
              data.RoomId = "Refer Notes";
            }
          })
          $scope.viewworkorder = response;
          pageIndex = pageIndex + 1;
          $scope.scrollToTop();
          // console.log($scope.viewworkorder);
        }
        else {
          $scope.hasData = 0;
          $scope.scrollToTop();
          $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
        }
        // $scope.viewworkorder = response;
        // console.log($scope.viewworkorder);
        // console.log(JSON.stringify($scope.viewworkorder));
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
      })
      .finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };
  $scope.doRefreshSupervisorView = function () {
    $scope.hasData = 1;
    pageIndex = 0;
    $scope.today_DT = convert_DT(new Date());
    // $ionicLoading.show();
    $scope.myPromise = $http.get(HOSTNAME + "/mob_page_viewDashboardWorkorder?viewdate=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)
      .success(function (response) {
        // $ionicLoading.hide();
        // debugger;
        if (response.length > 0) {
          response.forEach(function (data) {
            if (data.WorkorderTypeKey == - 1) {
              data.FloorName = "Refer Notes";
              data.ZoneName = "Refer Notes";
              data.RoomId = "Refer Notes";
            }
          })
          $scope.viewworkorder = response;
          pageIndex = pageIndex + 1;
          $scope.scrollToTop();
          // console.log($scope.viewworkorder);
        }
        else {
          $scope.hasData = 0;
          $scope.scrollToTop();
          $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
        }
        // $scope.viewworkorder = response;
        // console.log($scope.viewworkorder);
        // console.log(JSON.stringify($scope.viewworkorder));
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
      })
      .finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };
  $scope.loadFunction = function () {
    $scope.hasData = 1;
    pageIndex = 0;
    $scope.today_DT = convert_DT(new Date());
    // $ionicLoading.show();
    $scope.myPromise = $http.get(HOSTNAME + "/mob_page_viewDashboardWorkorder?viewdate=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)
      .success(function (response) {
        // debugger;
        if (response.length > 0) {
          response.forEach(function (data) {
            if (data.WorkorderTypeKey == - 1) {
              data.FloorName = "Refer Notes";
              data.ZoneName = "Refer Notes";
              data.RoomId = "Refer Notes";
            }
          })
          $scope.viewworkorder = response;
          pageIndex = pageIndex + 1;
          $scope.scrollToTop();
          // console.log($scope.viewworkorder);
        }
        else {
          $scope.hasData = 0;
          $scope.scrollToTop();
          $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
        }
        // $ionicLoading.hide();
        // $scope.viewworkorder = response;
        // console.log($scope.viewworkorder);
        // console.log(JSON.stringify($scope.viewworkorder));
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

  //Commented by Prakash Callingtwo times the load function
  //  $timeout(function () {
  //    $scope.loadFunction();
  //  }, 100);

  $scope.loadFunction();

  //..........FOR GETTINGB WORKORDER DETAILS....STARTS........



  // var workorderkey_viewDetails = $rootScope.workorderkey;
  // // alert(workorderkey_viewDetails);
  // if(workorderkey_viewDetails){
  //   // debugger;
  //   $http.get(HOSTNAME+"/workorderDetails?SearchKey=" + workorderkey_viewDetails)
  //     .success(function (response){

  //         $scope.viewEmpWorkorderDetails = response;
  //         console.log($scope.viewEmpWorkorderDetails);
  //     });
  // }
  // $scope.getDetailedWorkorder = function(workorderkey){
  //        $rootScope.workorderkey = workorderkey;
  //        // alert($rootScope.workorderkey);
  //        $state.go('employeeDashboard.detailedWorkorderView');
  //   };
  // $scope.filteringByFacilityGet = function(){
  //  // debugger;
  //      $state.go('employeeDashboard.filteringByFacility');
  // };
  $scope.viewEmployeeWorkorder = function (workorderkey) {
    $scope.showEmpWorkorderDetails = true;
    // $ionicLoading.show();
    $scope.myPromise = $http.get(HOSTNAME + "/workorderDetails?SearchKey=" + workorderkey + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        // debugger;
        $scope.viewEmpWorkorderDetails = response;
        $scope.scrollToTop();
        // $ionicLoading.hide();
        // console.log("viewWorkorderDetails "+$scope.viewEmpWorkorderDetails);
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
  //..........FOR GETTINGB WORKORDER DETAILS....ENDS........

  $scope.get_more = function () {
    $scope.hasData = 1;
    if (pageIndex > 0) {
      $scope.today_DT = convert_DT(new Date());
      // $ionicLoading.show();
      $scope.myPromise = $http.get(HOSTNAME + "/mob_page_viewDashboardWorkorder?viewdate=" + $scope.today_DT + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&pageindex=" + pageIndex)
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
