myApp.controller('PTOEditCtrl', function (HOSTNAME, $ionicPopup, $ionicPlatform, ionicDatePicker, $ionicLoading, $scope, $stateParams, $filter, $window, $ionicScrollDelegate, $state, $timeout, $http, $rootScope) {
    $scope.serverLocation = HOSTNAME;
    var token = window.localStorage.getItem('token');
    $window.localStorage['token'] = token;
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(url_base64_decode(encodedProfile));
    $scope.toServeremployeekey = profile.employeekey;
    $scope.OrganizationID = profile.OrganizationID;
    $scope.getBackgroundGeolocation($scope.toServeremployeekey);

    var ptoKey = $stateParams.ptorequestDetails;
    console.log("pto key " + ptoKey);

    // $scope.scrollMainToTop = function () {
    //     $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    // };

    // $scope.scrollSmallToTop = function () {
    //     $ionicScrollDelegate.$getByHandle('small').scrollTop();
    // };

    // $scope.scrollToTop = function () { //ng-click for back to top button
    //     $ionicScrollDelegate.scrollTop();
    //     $scope.sttButton = false;  //hide the button when reached top
    // };

    // $scope.scrollToTop();
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
    $scope.pto = {};
    if (ptoKey) {
        $scope.noWorksFound = false;
        $scope.myPromise = $http.get(HOSTNAME + "/getPTORequestDetailsforEmployee_mob?ptorequestDetails=" + ptoKey)
            .success(function (response) {
                $scope.viewEmpPTODetails = response;
                response.forEach(function (data) {
                    $scope.startdate = data.StartDate;
                    $scope.enddate = data.EndDate;
                    $scope.pto.ptoreason = data.Reason;
                    $scope.pto.Comments = data.Comments;
                })
            })
    }
    else {
        $scope.noWorksFound = true;
    }
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

    var ipObj = {
        callback: function (val) {  //Mandatory
            $scope.startdate = convert_DT(new Date(val));
            console.log($scope.startdate);
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
    $scope.openDatePicker1 = function () {
        ionicDatePicker.openDatePicker(ipObj);
    };


    var ipObj2 = {
        callback: function (val) {  //Mandatory
            $scope.enddate = convert_DT(new Date(val));
            console.log($scope.enddate);
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

    $scope.openDatePicker2 = function () {
        ionicDatePicker.openDatePicker(ipObj2);
    };

    $scope.updatePTODetails = function () {
        if ($scope.startdate) {
            if ($scope.startdate < $scope.dateValue) {
                var alertPopup = $ionicPopup.alert({
                    title: 'PTO EDIT',
                    template: "Start date can't be less than today"
                });
                return;
            } else {
                $scope.pto.StartDate = $scope.startdate;
            }
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'PTO EDIT',
                template: 'Start date is not provided!'
            });
            return;
        }

        if ($scope.enddate) {
            if ($scope.enddate < $scope.startdate) {
                var alertPopup = $ionicPopup.alert({
                    title: 'PTO EDIT',
                    template: "End date can't be less than start date"
                });
                return;
            } else {
                $scope.pto.EndDate = $scope.enddate;
            }

        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'PTO EDIT',
                template: 'End date is not provided!'
            });
            return;
        }
        $scope.pto.currdate = $scope.dateValue;
        $scope.pto.EmpKey = $scope.toServeremployeekey;
        $scope.pto.OrganizationID = $scope.OrganizationID;
        $scope.pto.Comments = $scope.pto.Comments;
        $scope.pto.Reason = $scope.pto.ptoreason;
        $scope.pto.ptorequestID = ptoKey;


        // console.log("PTO Details");
        // console.log("PTO Details"+$scope.pto.StartDate);
        // console.log("PTO Details"+$scope.pto.EndDate);
        // console.log("PTO Details"+$scope.pto.currdate);
        // console.log("PTO Details"+$scope.pto.EmpKey);
        // console.log("PTO Details"+$scope.pto.OrganizationID);
        // console.log("PTO Details"+$scope.pto.Comments);
        // console.log("PTO Details"+$scope.pto.Reason);
        // console.log("PTO Details"+$scope.pto.ptorequestID);

        $scope.myPromise = $http.post(HOSTNAME + "/setEditedPTORequest_mob", $scope.pto)
            .success(function (response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'PTO Request Updated Successfully'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    if (profile.role == 'Supervisor') {
                        $state.go('supervisorDashboard.supervisorViewPTO');
                    }
                    else if (profile.role == 'Employee') {
                        $state.go('employeeDashboard.employeeViewPTO');
                    }
                }, 5000);
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


    $scope.ptocancel = {};
    $scope.cancelPTO = function () {
        $scope.ptocancel.EmpKey = $scope.toServeremployeekey;
        $scope.ptocancel.OrgID = $scope.OrganizationID;
        $scope.ptocancel.ptorequestID = ptoKey;
        $scope.ptocancel.todayDate = $scope.dateValue;

        $scope.myPromise = $http.post(HOSTNAME + "/cancelPTORequest_mob", $scope.ptocancel)
            .success(function (response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Request successfully cancelled by employee'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    if (profile.role == 'Supervisor') {
                        $state.go('supervisorDashboard.supervisorViewPTO');
                    }
                    else if (profile.role == 'Employee') {
                        $state.go('employeeDashboard.employeeViewPTO');
                    }
                }, 5000);
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



    $scope.deletePTO = function () {
        $http.get(HOSTNAME + "/deletePTORequest_mob?deleteRequestKey=" + ptoKey + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Request successfully deleted by employee'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    if (profile.role == 'Supervisor') {
                        $state.go('supervisorDashboard.supervisorViewPTO');
                    }
                    else if (profile.role == 'Employee') {
                        $state.go('employeeDashboard.employeeViewPTO');
                    }
                }, 5000);
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
