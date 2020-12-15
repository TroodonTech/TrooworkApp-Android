myApp.controller('ptoCreateCtrl', function (HOSTNAME, $ionicPopup, $ionicPlatform, ionicDatePicker, $ionicLoading, $scope, $stateParams, $filter, $window, $ionicScrollDelegate, $state, $timeout, $http, $rootScope) {
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
            // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.startdate = convert_DT(new Date(val));
            console.log($scope.startdate);
            // $scope.workorderCreation.workorderDate = convert_DT_addOneDay(new Date(val));
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

    $scope.createPTORequest = function () {
        if ($scope.startdate) {
            $scope.pto.startdate = $scope.startdate;
            console.log($scope.startdate);
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'PTO Creation',
                template: 'Start date is not provided!'
            });
            return;
        }

        if ($scope.enddate) {
            $scope.pto.enddate = $scope.enddate;
            console.log($scope.enddate);
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'PTO Creation',
                template: 'End date is not provided!'
            });
            return;
        }

        console.log("comment " + $scope.comments);
        console.log("pto remain " + $scope.ptoremaining);

        $scope.pto.currentdate = $scope.dateValue;
        $scope.pto.employeekey = $scope.toServeremployeekey;
        $scope.pto.OrganizationID = $scope.OrganizationID;
        $scope.pto.comments = $scope.pto.comments;
        $scope.pto.ptoreason = $scope.pto.ptoreason;

        $scope.myPromise = $http.post(HOSTNAME + "/savePTORequest_mob", $scope.pto)
            .success(function (response) {
                // $scope.startdate = null;
                // $scope.enddate = null;
                // $scope.comments = null;
                // $scope.ptoremaining = null;
                // $scope.scrollToTop();
                var alertPopup = $ionicPopup.alert({
                    title: 'PTO Request Submitted Successfully'
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
                    // uploadingPopup.close();
                }, 1000);
            });
    };
});
