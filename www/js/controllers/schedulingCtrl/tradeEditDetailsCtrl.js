myApp.controller('tradeEditCtrl', function (HOSTNAME, $ionicPopup, $ionicPlatform, ionicDatePicker, $ionicLoading, $scope, $stateParams, $filter, $window, $ionicScrollDelegate, $state, $timeout, $http, $rootScope) {
    $scope.serverLocation = HOSTNAME;
    var token = window.localStorage.getItem('token');
    $window.localStorage['token'] = token;
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(url_base64_decode(encodedProfile));
    $scope.toServeremployeekey = profile.employeekey;
    $scope.OrganizationID = profile.OrganizationID;
    $scope.getBackgroundGeolocation($scope.toServeremployeekey);

    var tradeKey = $stateParams.traderequestDetails;
    console.log("trade key " + tradeKey);
    $scope.showDates = false;

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
    $scope.trade = {};
    if (tradeKey) {
        $scope.noWorksFound = false;
        $scope.myPromise = $http.get(HOSTNAME + "/getTradeRequestInfoforEmployee_mob?traderequestDetails=" + tradeKey + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                $scope.viewEmpTradeDetails = response;
                response.forEach(function (data) {
                    $scope.startdate = data.StartDate;
                    $scope.enddate = data.EndDate;
                    $scope.otherempKey = data.OtherEmployeeKey;
                    // $scope.trade.EmployeeKey= data.OtherEmployeeKey;
                    $scope.trade.Comments = data.Comments;
                })
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
        $scope.myPromise = $http.get(HOSTNAME + "/getAssignmentTradebyID_mob?traderequestID=" + tradeKey)
            .success(function (response) {
                $scope.assignmentdetails = response;
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

        $scope.myPromise = $http.get(HOSTNAME + "/getAllEmployeeNames_SuType_mob?OrganizationID=" + $scope.OrganizationID + "&employeekey=" + $scope.toServeremployeekey)
            .success(function (response1) {
                $scope.allEmployeeList = response1;
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
        $scope.showDates = false;
    });

    var ipObj = {
        callback: function (val) {  //Mandatory
            $scope.startdate = convert_DT(new Date(val));
            $scope.approvinngstartdate = convert_DT(new Date(val));
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
            $scope.approvinngenddate = convert_DT(new Date(val));
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

    $scope.updateTradeDetails = function () {
        if ($scope.startdate) {
            $scope.trade.StartDate = $scope.startdate;
            console.log($scope.startdate);
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Trade Creation',
                template: 'Start date is not provided!'
            });
            return;
        }

        if ($scope.enddate) {
            $scope.trade.EndDate = $scope.enddate;
            console.log($scope.enddate);
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Trade Creation',
                template: 'End date is not provided!'
            });
            return;
        }


        if ($scope.trade.EmployeeKey) {
            console.log($scope.trade.EmployeeKey);
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Trade Creation',
                template: 'Employee is not provided!'
            });
            return;
        }

        if ($scope.trade.Comments) {
            console.log($scope.trade.Comments);
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Trade Creation',
                template: 'Comments is not provided!'
            });
            return;
        }

        $scope.trade.currdate = $scope.dateValue;
        $scope.trade.Comments = $scope.trade.Comments;
        $scope.trade.OtherEmployee = $scope.trade.EmployeeKey;
        $scope.trade.traderequestID = tradeKey;

        console.log($scope.trade.OtherEmployee);

        $scope.myPromise = $http.post(HOSTNAME + "/setEditedTradeRequest_mob", $scope.trade)
            .success(function (response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Trade Request Updated Successfully'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    if (profile.role == 'Supervisor') {
                        $state.go('supervisorDashboard.supervisorViewTrade');
                    }
                    else if (profile.role == 'Employee') {
                        $state.go('employeeDashboard.employeeViewTrade');
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


    $scope.tradecancel = {};
    $scope.cancelTrade = function () {
        $scope.tradecancel.EmpKey = $scope.toServeremployeekey;
        $scope.tradecancel.traderequestID = tradeKey;
        $scope.tradecancel.todayDate = $scope.dateValue;

        $scope.myPromise = $http.post(HOSTNAME + "/requestForTradeCancel_mob", $scope.tradecancel)
            .success(function (response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Cancelling the trade requested successfully'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    if (profile.role == 'Supervisor') {
                        $state.go('supervisorDashboard.supervisorViewTrade');
                    }
                    else if (profile.role == 'Employee') {
                        $state.go('employeeDashboard.employeeViewTrade');
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


    $scope.tradecancel1 = {};
    $scope.cancelApproveTrade = function () {
        $scope.tradecancel.EmpKey = $scope.toServeremployeekey;
        $scope.tradecancel.traderequestID = tradeKey;
        $scope.tradecancel.todayDate = $scope.dateValue;

        $scope.myPromise = $http.post(HOSTNAME + "/tradeCancelApprove_mob", $scope.tradecancel)
            .success(function (response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Trade request cancelled successfully'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    if (profile.role == 'Supervisor') {
                        $state.go('supervisorDashboard.supervisorViewTrade');
                    }
                    else if (profile.role == 'Employee') {
                        $state.go('employeeDashboard.employeeViewTrade');
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

    $scope.deleteTrade = function () {
        $http.get(HOSTNAME + "/deleteTradeRequest_mob?deleteRequestKey=" + tradeKey + "&employeeKey=" + $scope.toServeremployeekey)
            .success(function (response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Request successfully deleted by employee'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    if (profile.role == 'Supervisor') {
                        $state.go('supervisorDashboard.supervisorViewTrade');
                    }
                    else if (profile.role == 'Employee') {
                        $state.go('employeeDashboard.employeeViewTrade');
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


    $scope.tradeapprove = {}

    $scope.saveTradeApproval = function () {

        if ($scope.trade.Status) {
            if ($scope.trade.Status === 'Approved') {
                if ($scope.approvinngstartdate) {
                    if ($scope.approvinngstartdate >= $scope.startdate && $scope.approvinngstartdate <= $scope.enddate) {
                        console.log($scope.approvinngstartdate);
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Trade Creation',
                            template: 'Approved start date must be between requested dates!'
                        });
                        return;
                    }
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Trade Creation',
                        template: 'Approving Start date is not provided!'
                    });
                    return;
                }

                if ($scope.approvinngenddate) {
                    if ($scope.approvinngenddate >= $scope.startdate && $scope.approvinngenddate <= $scope.enddate) {
                        console.log($scope.approvinngenddate);
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Trade Creation',
                            template: 'Approved end date must be between requested dates!'
                        });
                        return;
                    }
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Trade Creation',
                        template: 'Approving End date is not provided!'
                    });
                    return;
                }
            } else {
                $scope.approvinngstartdate = null;
                $scope.approvinngenddate = null;

                if ($scope.tradeapprove.EmployeeComments) {
                    console.log($scope.tradeapprove.EmployeeComments);
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Trade Creation',
                        template: 'Employee Comments is not provided!'
                    });
                    return;
                }

            }
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Trade Creation',
                template: 'Status is not provided!'
            });
            return;
        }

        $scope.tradeapprove.ApprovedEndDate = $scope.approvinngenddate;
        $scope.tradeapprove.StatusKey = $scope.trade.Status;
        $scope.tradeapprove.approvedstartdate = $scope.approvinngstartdate;
        $scope.tradeapprove.employeekey = $scope.toServeremployeekey;
        $scope.tradeapprove.statuscurrentdate = $scope.dateValue;
        $scope.tradeapprove.statuscomments = $scope.tradeapprove.EmployeeComments;
        $scope.tradeapprove.tradeRequestID = tradeKey;


        $scope.myPromise = $http.post(HOSTNAME + "/saveTradeRequestAction_mob", $scope.tradeapprove)
            .success(function (response) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Trade Request Approved by employee Successfully'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    if (profile.role == 'Supervisor') {
                        $state.go('supervisorDashboard.supervisorViewTrade');
                    }
                    else if (profile.role == 'Employee') {
                        $state.go('employeeDashboard.employeeViewTrade');
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
    $scope.selectStatus = function () {
        if ($scope.trade.Status === "Approved") {
            $scope.showDates = true;
        } else {
            $scope.showDates = false;
        }
    };

});
