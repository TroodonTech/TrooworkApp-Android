

myApp.controller('inspectionViewCtrl', function (HOSTNAME, $ionicLoading, $ionicPopup, $scope, $http, $state, $timeout, $rootScope, $window, $stateParams, $ionicLoading, $ionicScrollDelegate) {
  var employeekey = window.localStorage.getItem("employeekey");
  $scope.welcome = 'Welcome ' + employeekey + ' ';

  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  console.log(profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.OrganizationID = profile.OrganizationID;
  $scope.getBackgroundGeolocation($scope.toServeremployeekey);
  var username = window.localStorage.getItem("username");
  $scope.employeekey = window.localStorage.getItem("employeekey");
  console.log("inside inspectionViewCtrl");
  $scope.scrollToTop = function () { //ng-click for back to top button
    $ionicScrollDelegate.scrollTop();
    $scope.sttButton = false;  //hide the button when reached top
  };
  $scope.sttButton = false;



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
  // debugger;
  $scope.managerInspection = false;
  $scope.doRefresh = function () { //for supervisor only
    var todat_date = convert_DT(new Date());
    if ($scope.toServeremployeekey) {
      // $ionicLoading.show();
      $scope.myPromise = $http.get(HOSTNAME + "/getSupervisorInspectionView_pick?to_date=" + todat_date + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
          $scope.scrollToTop();
          // $ionicLoading.hide();
          if (response.length) {
            $scope.viewinspection = response;
            $scope.inspectioncompletedby = response.InspectionCompletedBy;

            $scope.disableNext = false;
          }
          else {
            $scope.disableNext = true;
            $scope.viewinspection = [{ "TemplateName": "No inspection found!", "FirstName": "Unassigned" }];
          }
          // $scope.viewinspection = response;
          // console.log("inspection.."+response);
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
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }
    else {
      $state.go('login');
    }

  };
  console.log($scope.toServeremployeekey);
  $scope.today_DT = convert_DT(new Date());
  $scope.loadInspection = function () { //for both supervisor and manager view

    // $ionicLoading.show();
    var todat_date = convert_DT(new Date());
    //alert(todat_date);
    // console.log(todat_date+" "+$scope.toServeremployeekey);
    $scope.myPromise = $http.get(HOSTNAME + "/getSupervisorInspectionView_pick?to_date=" + todat_date + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        // debugger;
        $scope.scrollToTop();
        // $ionicLoading.hide();
        if (response.length) {
          // console.log(response);
          $scope.viewinspection = response;
          $scope.inspectioncompletedby = response.InspectionCompletedBy;

          $scope.disableNext = false;
        }
        else {
          $scope.disableNext = true;
          $scope.viewinspection = [{ "TemplateName": "No inspection found!", "FirstName": "Unassigned" }];
          // console.log($scope.viewinspection);
        }
        // $scope.viewinspection = response;
        // $scope.inspectioncompletedby = response.InspectionCompletedBy;
        // console.log("inspection.."+".."+JSON.stringify(response)+"..."+$scope.inspectioncompletedby);
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
  $timeout(function () {
    $scope.loadInspection();
  }, 100);
  $scope.loadInspection();
  $scope.getInspectionDetails = function (inspectionorderKey, templateId, templateName) {
    // alert("haiii"+inspectionorderKey+ " "+templateId+" "+templateName);
    $rootScope.inspectKey = inspectionorderKey;
    $rootScope.templID = templateId;
    $rootScope.templName = templateName;
    $scope.scrollToTop();
    // $state.go("inspect");
    $state.go('supervisorDashboard.inspectionDetails');
  };


  $scope.inspectionDetailsByManager = function (data) {

    console.log("called inspectiondetails by manager QQQQQQQQ  " + data.InspectionOrderKey);
    $scope.managerkey = "" + data.EmployeeKey;
    // console.log($scope.managerkey === $scope.toServeremployeekey);
    if ($scope.managerkey === $scope.toServeremployeekey && data.InspectionCompletedBy === null) { //not completed manager inspection
      console.log("inside 1st if" + $scope.toServeremployeekey);
      $rootScope.inspectKey = data.InspectionOrderKey;
      $rootScope.templID = data.TemplateId;
      $rootScope.templName = data.TemplateName;
      $state.go('managerDashboard.inspectionDetails');
    }
    else if ($scope.managerkey !== $scope.toServeremployeekey && data.InspectionCompletedBy === null) { //not completed supervisor inspection
      console.log("inside supervisor not completed" + $scope.toServeremployeekey);
      $state.go('managerDashboard.afterInspectionManagerView', { inspectionorderkey: data.InspectionOrderKey });
    }
    else if (data.InspectionCompletedBy !== null) { //completed inspection
      console.log("completed inspection");
      $state.go('managerDashboard.afterInspectionManagerView', { inspectionorderkey: data.InspectionOrderKey });
    }
  };


  function convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  ;
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
  ;

  // $http.get($scope.serverLocation+ "/viewInspection?date=" + $scope.today_DT)
  //     .success(function (response)
  //     {
  //         if(response.length){
  //         $scope.inspectionManagerView = response;
  //         // $scope.noInspectionProvided = true;
  //         // $scope.inspectioncompletedby = response[0].InspectionCompletedBy;
  //         console.log($scope.inspectionManagerView);
  //       }
  //     else{
  //       $scope.inspectionManagerView = [{"TemplateName":"No inspection found!","FirstName":"Unassigned"}];
  //       // $scope.noInspectionProvided = false;

  //       console.log($scope.inspectionManagerView);
  //     }
  //         // $scope.viewinspection = response;
  //         // $scope.inspectioncompletedby = response.InspectionCompletedBy;
  //         // console.log($scope.inspectionManagerView);
  //     });



  //             $scope.itemsperpage = 5;
  //             $scope.pageno = 1;
  //             var currentPage = 1;
  //             $scope.slideHasChanged = function(index) {
  //                 // $ionicLoading.show();
  //               $scope.myPromise =  $http.get(HOSTNAME+ "/viewInspection?inspectionDate=" + $scope.today_DT+"&pageno="+index+"&itemsPerPage="+$scope.itemsperpage+"&employeekey="+$scope.toServeremployeekey )
  //                 .success(function (response)
  //                 {
  //                     $scope.scrollToTop();
  //                     // $ionicLoading.hide();
  //                     if(response.length){
  //                     $scope.inspectionManagerView = response;
  //                     $scope.inspectioncompletedby = response.InspectionCompletedBy;
  //                     // console.log($scope.inspectionManagerView);
  //                     $scope.disableNext = false;
  //                   }
  //                 else{
  //                     $scope.disableNext = true;
  //                   $scope.inspectionManagerView = [{"TemplateName":"No inspection found!","FirstName":"Unassigned"}];
  //                   // console.log($scope.inspectionManagerView);
  //                 }
  //                     // $scope.viewinspection = response;
  //                     // $scope.inspectioncompletedby = response.InspectionCompletedBy;
  //                     // console.log("inspection.."+".."+JSON.stringify(response)+"..."+$scope.inspectioncompletedby);
  //                 })
  //                 .error(function(error){
  //                   var alertPopup = $ionicPopup.alert({
  //                          title: 'Something went Wrong',
  //                          template: 'Please relogin!'
  //                                                    });
  //                    $timeout(function() {
  //                                 $ionicLoading.hide();
  //                                       alertPopup.close();
  //                                       // uploadingPopup.close();
  //                                    }, 1000);
  //             });
  //             };
  // $scope.slideHasChanged($scope.pageno);


  //                 $scope.moredata = false;
  // $scope.disableNext = false;
  //     $scope.loadMoreData=function()
  //     {
  //         // $ionicLoading.show();
  //          index = $scope.pageno;
  //         var index = index + 1;
  //         $scope.pageno = index;
  //         // console.log("ssss "+index+"..."+$scope.pageno);

  //       $scope.myPromise =  $http.get(HOSTNAME+ "/viewInspection?inspectionDate=" + $scope.today_DT+"&pageno="+index+"&itemsPerPage="+$scope.itemsperpage)
  //                 .success(function (response)
  //                 {
  //                     $scope.scrollToTop();
  //                     // $ionicLoading.hide();
  //                     if(response.length){
  //                         $scope.disableNext = false;
  //                         $scope.inspectionManagerView = response;
  //                         $scope.inspectioncompletedby = response.InspectionCompletedBy;
  //                         // console.log($scope.inspectionManagerView);

  //                     }
  //                     else{
  //                         $scope.disableNext = true;
  //                         $scope.inspectionManagerView = [{"TemplateName":"No inspection found!","FirstName":"Unassigned"}];
  //                         // console.log($scope.inspectionManagerView);
  //                     }
  //                 })
  //                 .error(function(error){
  //                   var alertPopup = $ionicPopup.alert({
  //                          title: 'Something went Wrong',
  //                          template: 'Please relogin!'
  //                                                    });
  //                    $timeout(function() {
  //                                 $ionicLoading.hide();
  //                                       alertPopup.close();
  //                                       // uploadingPopup.close();
  //                                    }, 1000);
  //             });


  //       $scope.$broadcast('scroll.infiniteScrollComplete');
  //     };

  // // $ionicLoading.hide();
  //     $scope.loadLessData=function()
  //     {
  //         // $ionicLoading.show();
  //          index = $scope.pageno;
  //         var index = index - 1;

  //         // console.log("ssss "+index+"..."+$scope.pageno);
  //         $scope.pageno = index;
  //         // console.log("ssss "+index+"..."+$scope.pageno);
  //      $scope.myPromise =   $http.get(HOSTNAME+ "/viewInspection?inspectionDate=" + $scope.today_DT+"&pageno="+index+"&itemsPerPage="+$scope.itemsperpage)
  //                 .success(function (response)
  //                 {
  //                     $scope.scrollToTop();
  //                     // $ionicLoading.hide();
  //                     if(response.length){
  //                         $scope.disableNext = false;
  //                         $scope.inspectionManagerView = response;
  //                         $scope.inspectioncompletedby = response.InspectionCompletedBy;
  //                         // console.log($scope.inspectionManagerView);
  //                     }
  //                     else{
  //                         $scope.disableNext = true;
  //                         $scope.inspectionManagerView = [{"TemplateName":"No inspection found!","FirstName":"Unassigned"}];
  //                         // ($scope.inspectionManagerView);
  //                     }
  //                 })
  //                 .error(function(error){
  //                   var alertPopup = $ionicPopup.alert({
  //                          title: 'Something went Wrong',
  //                          template: 'Please relogin!'
  //                                                    });
  //                    $timeout(function() {
  //                                 $ionicLoading.hide();
  //                                       alertPopup.close();
  //                                       // uploadingPopup.close();
  //                                    }, 1000);
  //                    $timeout(function() {
  //                                 $ionicLoading.hide();
  //                                       alertPopup.close();
  //                                       // uploadingPopup.close();
  //                                    }, 1000);
  //             });
  //       $scope.$broadcast('scroll.infiniteScrollComplete');
  //     };


document.addEventListener("deviceready", function (){
                                                 window.screen.orientation.unlock(); // or ‘portrait’
                                                 }, false);
});
