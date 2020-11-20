//controller for view all workorder ->manager
myApp.controller('inspectionAddCtrl', function ($ionicPlatform, HOSTNAME, $ionicLoading, $scope, $stateParams, $ionicPopup, $filter, ionicTimePicker, ionicDatePicker, $window, $ionicScrollDelegate, $state, $timeout, $http, $rootScope) {
    //       //$scope.vwok = [];
    // $scope.empKey = window.localStorage.getItem('employeeKey');
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
    var token = window.localStorage.getItem('token');
    $window.localStorage['token'] = token;
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(url_base64_decode(encodedProfile));
    // console.log(profile);
    $scope.toServeremployeekey = profile.employeekey;
    $scope.OrganizationID = profile.OrganizationID;
    var Employeekey_manager = $scope.toServeremployeekey;
    // alert(empKey);
    $scope.getBackgroundGeolocation($scope.toServeremployeekey);
    console.log("INSIDE inspectionAddCtrl " + parseInt($scope.toServeremployeekey));
    $scope.inspectionAdd = {};
    $scope.auditSupKey = parseInt($scope.toServeremployeekey);
    console.log("supkey " + $scope.inspectionAdd.SupervisorKey);
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

    function convert_DT_calendar(str) {
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
    $rootScope.toServeremployeekey = profile.employeekey;
    $scope.dateValue = convert_DT_calendar(new Date());
    $scope.timeValue = new Date().getHours() + ':' + new Date().getMinutes();
    $scope.getWorkordersBychangingEmployeeDate = function () {
        if ($scope.dateValue) {
            $scope.inspectionAdd.inspectiondate = convert_DT($scope.dateValue);
        }
        else {
            $scope.inspectionAdd.inspectiondate = convert_DT(new Date());
        }
        var employeekey = $scope.inspectionAdd.EmployeeKey.EmployeeKey;
        $scope.workorderList = [];
        $scope.myPromise = $http.get(HOSTNAME + "/allWorkordersByEmployeeKey?viewdate=" + $scope.inspectionAdd.inspectiondate + "&employeekey=" + employeekey + "&managerkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                if (response.length > 0) {
                    $scope.workorderList = response;
                    $scope.showWorkorder = true;
                }
                else {
                    $scope.showWorkorder = false;
                }
                // console.log(JSON.stringify(response));
            })
            .error(function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Something went Wrong',
                    template: 'Please relogin!'
                });
            });
    };
    $scope.pageno = 1;
    $scope.showWorkorder = false;
    $scope.noRecords = false;
    $scope.showCheckButton = false;
    $scope.selected = {};
    $scope.checkedAllWorkorders = function (selectedWorkorder) {
        // console.log(selectedWorkorder);
        if (selectedWorkorder === true) {
            $scope.selectedWorkorder = true;
        }
        else {
            $scope.selectedWorkorder = false;
        }
        for (var i = 0; i < $scope.workorderList.length; i++) {
            var data = $scope.workorderList[i];
            $scope.selected[data.WorkorderKey] = $scope.selectedWorkorder;
        }
    };

    $scope.buttonToggling = function () {
        $scope.showCheckButton = true;
    };

    $scope.checkingForCompletedWork = function () {
        if ($scope.inspectionAdd.FacilityKey) {
            $scope.inspectionAdd.facilityKey = $scope.inspectionAdd.FacilityKey.FacilityKey;
        }
        else {
            $scope.inspectionAdd.facilityKey = null;
            var alertPopup = $ionicPopup.alert({
                title: 'Submit failed',
                template: 'Location is not provided!'
            });
            return;
        }
        var roomlistObj = [];
        var roomlist = [];
        // debugger;
        roomlistObj = $scope.roomList;
        var roomString;
        if ($scope.inspectionAdd.RoomKey) {
            roomString = $scope.inspectionAdd.RoomKey.RoomKey;
        }
        else {
            if (roomlistObj) {
                for (var j = 0; j < roomlistObj.length; j++) {
                    roomlist.push(roomlistObj[j].RoomKey);
                }
                roomString = roomlist.join(',');
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Submit failed',
                    template: 'Location is not provided!'
                });
                return;
            }
        }
        $scope.inspectionAdd.roomKey = roomString;
        if (roomlistObj.length === 0) {
            var alertPopup = $ionicPopup.alert({
                title: 'Submit failed',
                template: 'Room is not provided!'
            });
            return;
        }
        $scope.inspectionAdd.metaUpdatedBy = $scope.toServeremployeekey;
        $scope.inspectionAdd.OrganizationID = $scope.OrganizationID;
        console.log($scope.inspectionAdd);
        $scope.myPromise = $http.post($scope.serverLocation + "/addInspectionOrderwithoutWorkorder", $scope.inspectionAdd)
            .success(function (response) {
                console.log(response);
                $scope.showCheckButton = false;

                if (response.length > 0) {
                    $scope.workorderList = response;
                    $scope.showWorkorder = true;
                    $scope.showCheckButton = false;
                    $scope.noRecords = false;
                }
                else {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Inspection order creation failed',
                        template: 'Work orders are not completed!'
                    });
                }
                $scope.inspectionAdd.FacilityKey = null;
                $scope.inspectionAdd.RoomKey = null;
                $scope.inspectionAdd.FloorKey = null;
                $scope.inspectionAdd.ZoneKey = null;
            });
    };
    $scope.AddInspectionOrder = function (showWorkorder) {

        $scope.scrollToTop();
        if ($scope.inspectionAdd.TemplateID) {
            $scope.inspectionAdd.templateID = $scope.inspectionAdd.TemplateID.TemplateID;
            $rootScope.templID = $scope.inspectionAdd.templateID;
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'Submit failed',
                template: 'Template name is not provided!'
            });
            return;
        }
        if ($scope.timeValue) {
            $scope.inspectionAdd.inspectiontime = $scope.timeValue;
        }
        else {
            $scope.timeValue = new Date().getHours() + ':' + new Date().getMinutes();
            // console.log("time"+$scope.timeValue);
            $scope.inspectionAdd.inspectiontime = $scope.timeValue;
        }
        if ($scope.dateValue) {
            $scope.inspectionAdd.inspectiondate = convert_DT_addOneDay($scope.dateValue);
        }
        else {
            $scope.inspectionAdd.inspectiondate = convert_DT_addOneDay(new Date());
        }
        if ($scope.inspectionAdd.SupervisorKey) {
            $scope.inspectionAdd.supervisorKey = $scope.inspectionAdd.SupervisorKey;
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'Submit failed',
                template: 'Auditor name is not provided!'
            });
            return;
        }
        $scope.inspectionAdd.metaUpdatedBy = $scope.toServeremployeekey;


        if ($scope.inspectionAdd.EmployeeKey) {
            $scope.inspectionAdd.empkey = $scope.inspectionAdd.EmployeeKey.EmployeeKey;
        }
        else {
            $scope.inspectionAdd.empkey = -1;
        }


        if ($scope.inspectionAdd.FacilityKey) {
            $scope.inspectionAdd.facilityKey = $scope.inspectionAdd.FacilityKey.FacilityKey;
        }
        else {
            $scope.inspectionAdd.facilityKey = null;
            var alertPopup = $ionicPopup.alert({
                title: 'Submit failed',
                template: 'Building is not provided!'
            });
            return;
        }
        if (!$scope.inspectionAdd.FloorKey) {


            var alertPopup = $ionicPopup.alert({
                title: 'Submit failed',
                template: 'Floor is not provided!'
            });
            return;
        }
        if (!$scope.inspectionAdd.RoomKey && !$scope.inspectionAdd.RoomTypeKey) {
            console.log("Room or RoomType is not provided!")

            var alertPopup = $ionicPopup.alert({
                title: 'Submit failed',
                template: 'Room or RoomType is not provided!'
            });
            return;
        }
        var roomlistObj = [];
        var roomlist = [];
        // debugger;
        roomlistObj = $scope.roomList;
        var roomString;
        if ($scope.inspectionAdd.RoomKey) {
            roomString = $scope.inspectionAdd.RoomKey.RoomKey;
        }
        else {
            if (roomlistObj) {
                for (var j = 0; j < roomlistObj.length; j++) {
                    roomlist.push(roomlistObj[j].RoomKey);
                }
                roomString = roomlist.join(',');
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Submit failed',
                    template: 'Room has no value!'
                });
                return;
            }
        }
        $scope.inspectionAdd.roomKey = roomString;
        if (roomlistObj.length === 0) {
            var alertPopup = $ionicPopup.alert({
                title: 'Submit failed',
                template: 'Room is not provided!'
            });
            return;
        }
        var t = new Date();
        var y = t.getFullYear();
        var m = t.getMonth();
        var d = t.getDate();
        var h = t.getHours();
        var mi = t.getMinutes();
        var s = t.getSeconds();

        $scope.today_DT = convert_DT(new Date());
        var p = "";
        p = $scope.today_DT + " " + h + ":" + mi + ":" + s;


        $scope.inspectionAdd.fulltime = p;




        $scope.inspectionAdd.metaUpdatedBy = $scope.toServeremployeekey;
        $scope.inspectionAdd.OrganizationID = $scope.OrganizationID;
        console.log($scope.inspectionAdd);
        $scope.myPromise = $http.post($scope.serverLocation + "/addInspectionOrderwithoutWorkorder", $scope.inspectionAdd)
            .success(function (res) {
                $scope.newInspectKey = res[0].InspectionOrderKey;
                // console.log("InspectionOrderKey"+$scope.newInspectKey);
                if ($scope.newInspectKey) {
                    $rootScope.inspectKey = $scope.newInspectKey;
                    $rootScope.templID = $scope.inspectionAdd.templateID;
                    $rootScope.templName = $scope.inspectionAdd.TemplateID.TemplateName;
                    // console.log("inspectkey "+$rootScope.inspectKey+" tempID "+$rootScope.templID+" tempName "+$rootScope.templName);
                    var auditorKey = $scope.inspectionAdd.supervisorKey;
                    // console.log(auditorKey == Employeekey_manager);
                    if (auditorKey == Employeekey_manager) {
                        if (profile.role == 'Supervisor') {
                            $state.go('supervisorDashboard.inspectionDetails');
                        }
                        else if (profile.role == 'Manager') {
                            $state.go('managerDashboard.inspectionDetails');
                        }
                    }
                    else {
                        $scope.showWorkorder = false;
                        $scope.showCheckButton = false;
                        if (profile.role == 'Supervisor') {
                            $state.go('supervisorDashboard.inspection');
                        }
                        else if (profile.role == 'Manager') {
                            $state.go('managerDashboard.inspectionorder');
                        }
                        var alertPopup = $ionicPopup.alert({
                            title: 'Successfully Added!'
                        }); $timeout(function () {
                            $ionicLoading.hide();
                            alertPopup.close();
                            // uploadingPopup.close();
                        }, 1000);
                    }
                    $scope.workorderkeyslist = [];
                    var selectedWorkorderlist = [];
                    $scope.records = [];
                    $scope.showWorkorder = false;
                    $scope.inspectionAdd = [];
                    $scope.timeValue = null;
                    var workorderkeyString = null;
                    $scope.inspectionAdd.workorderkeylist = null;
                    $scope.inspectionAdd.SupervisorKey = null;
                    $scope.inspectionAdd.TemplateID = null;
                    $scope.inspectionAdd.EmployeeKey = null;
                    $scope.inspectionAdd.FacilityKey = null;
                }
            });


    };
    var selectedWorkorderlist = [];
    var workorderkeyString;

    $scope.workorderkeyslist = [];

    $scope.records = [];

    $scope.getWorkorderkeylistAsString = function () {
        debugger;
        // $scope.workorderList =[];
        $scope.inspectionAdd.workorderkeylist = null;
        selectedWorkorderlist = null;
        workorderkeyString = null;
        $scope.records = null;
        console.log($scope.workorderList);
        console.log(selectedWorkorderlist);
        console.log($scope.records);
        if ($scope.workorderList.length > 0) {
            $scope.records = $.grep($scope.workorderList, function (data) {
                return $scope.selected[data.WorkorderKey];
            });
            selectedWorkorderlist = $scope.records;
            if (selectedWorkorderlist.length === 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Inspection Creation Failed!',
                    template: 'Please select work order!'
                });
                return workorderkeyString = 0;
            }
            for (var j = 0; j < selectedWorkorderlist.length; j++) {
                $scope.workorderkeyslist.push(selectedWorkorderlist[j].WorkorderKey);
            }
            workorderkeyString = $scope.workorderkeyslist.join(',');
            // console.log(workorderkeyString);
            return workorderkeyString;
        }
        else {
            return workorderkeyString = 0;
        }

    };


    // function convert_DT_addOneDay(str) {// reduce one day for display
    //                   var today = new Date(str);

    //                     var tomorrow = new Date(str);
    //                     tomorrow.setDate(today.getDate()+1);

    //                         // mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    //                         // day = ("0" + (date.getDate()+1)).slice(-2);
    //                 return [tomorrow.getFullYear(), tomorrow.getMonth()+1, tomorrow.getDate()].join("-");
    //             } commented in july 2018


    function convert_DT_addOneDay(str) {
        var today = new Date(str);
        var z = " 00:00";
        var str1 = new Date();
        str1 = str.concat(z);
        var yr = str.substring(0, 4);
        var mm = str.substring(5, 7);
        mm = mm - 1;
        var dd = str.substring(8, 10);
        var tomorrow = new Date(yr, mm, dd);
        console.log("Value in str1 console" + str1);
        console.log("Value in console" + tomorrow);
        //date added here to fix the issue-Earlier Build
        // tomorrow.setDate(today.getDate()+1); //commented in July 2018 Release

        // mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        // day = ("0" + (date.getDate()+1)).slice(-2);
        return [tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate()].join("-");
    }

    $scope.myPromise = $http.get($scope.serverLocation + "/mob_scoringtype?OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
            $scope.ScoreName = response;
            // console.log(JSON.stringify(response));
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
    $scope.myPromise = $http.get(HOSTNAME + "/mob_allemployees?empkey=" + $rootScope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
            // $ionicLoading.hide();
            $scope.employeeListManagerView = response;
            // console.log($scope.employeeListManagerView);
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
    $scope.myPromise = $http.get($scope.serverLocation + "/mob_getAllEmployeesDetailsOnly?OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
            $scope.allemployees = response;
            // console.log(JSON.stringify(response));
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
    $scope.myPromise = $http.get($scope.serverLocation + "/mob_supervisorname?employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
            $scope.supervisorName = response;
            // console.log(JSON.stringify(response));
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
    $scope.myPromise = $http.get($scope.serverLocation + "/getTemplatesNameFor_pick_Mob?employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
            $scope.templateList = response;
            console.log("templateList name " + $scope.templateList[0].TemplateName);
            // console.log(JSON.stringify(response));
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
    $scope.myPromise = $http.get($scope.serverLocation + "/mob_allfacility?empkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
            $scope.facilityList = response;
            // console.log(JSON.stringify(response));
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
    $scope.inspectionAdd = {};
    $scope.getAllTemplates = function (ScoreTypeKey) {
        // $ionicLoading.show();
        // alert("inside getalltemplates" +$scope.ScoreTypekey.ScoreTypekey);
        var scoringTypeKey = ScoreTypeKey;

        // console.log("scoringTypeKey...." + scoringTypeKey);
        $scope.myPromise = $http.get($scope.serverLocation + "/getAllTemplates?scoringTypeKey=" + scoringTypeKey + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                // $ionicLoading.hide();
                $scope.templateList = response;
                // console.log(JSON.stringify(response));
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
    // $ionicLoading.hide();
    //START/Dynamically fetches values for floor, zone, roomtype, room based on selected facility
    $scope.selectedFacility = function () {

        if ($scope.inspectionAdd.FacilityKey) {
            var fac_key = $scope.inspectionAdd.FacilityKey.FacilityKey;
            var domain = 'facilityOnly';
            // $ionicLoading.show();
            $scope.myPromise = $http.get($scope.serverLocation + "/domainvaluesByKey?domain=" + domain + "&key=" + fac_key + "&OrganizationID=" + $scope.OrganizationID).success(function (response) {
                // $ionicLoading.hide();
                $scope.floorList = response;
                $scope.zoneList = null;
                $scope.roomtypeList = null;
                $scope.roomList = null;
                // console.log(JSON.stringify(response));
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
        }
        else {
            // $ionicLoading.hide();
            $scope.floorList = null;
            $scope.zoneList = null;
            $scope.roomtypeList = null;
            $scope.roomList = null;
            return;
        }
    };
    //ENDS/Dynamically fetches values for floor, zone, roomtype, room based on selected facility
    // Starts floor based change on zone, roomtype, room
    $scope.changedFloor = function () {
        //Facility and floor are given
        if ($scope.inspectionAdd.FloorKey) {
            // $ionicLoading.show();
            var fac_key = $scope.inspectionAdd.FacilityKey.FacilityKey;
            var floor_key = $scope.inspectionAdd.FloorKey.FloorKey;
            // console.log("Floor key " + floor_key);

            $scope.myPromise = $http.get($scope.serverLocation + "/zoneByFacility_Floor?fkey=" + fac_key + "&floorkey=" + floor_key + "&OrganizationID=" + $scope.OrganizationID)
                .success(function (response) {
                    // $ionicLoading.hide();
                    $scope.zoneList = response;
                    // console.log(JSON.stringify(response));
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
            $scope.myPromise = $http.get($scope.serverLocation + "/roomtypeByFacility_Floor?fkey=" + fac_key + "&floorkey=" + floor_key + "&OrganizationID=" + $scope.OrganizationID)
                .success(function (response) {
                    // $ionicLoading.hide();
                    $scope.roomtypeList = response;
                    // console.log(JSON.stringify(response));
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
            $scope.myPromise = $http.get($scope.serverLocation + "/roomByFacility_Floor?fkey=" + fac_key + "&floorkey=" + floor_key + "&OrganizationID=" + $scope.OrganizationID)
                .success(function (response) {
                    // $ionicLoading.hide();
                    $scope.roomList = response;
                    // console.log(JSON.stringify(response));
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
            // $ionicLoading.hide();
        } else {
            // $ionicLoading.hide();
            $scope.selectedFacility();
            return;
        }
    };
    /// starts zone based change
    $scope.changedZone = function () {
        //Given either Facility and Floor and Zone
        //Given either Facility and Zone                 make changes to roomtype and room

        if ($scope.inspectionAdd.ZoneKey) {
            // $ionicLoading.show();
            var fac_key = $scope.inspectionAdd.FacilityKey.FacilityKey;
            var zonekey = $scope.inspectionAdd.ZoneKey.ZoneKey;
            if ($scope.inspectionAdd.FloorKey) {
                var floor_key = $scope.inspectionAdd.FloorKey.FloorKey;
                $scope.myPromise = $http.get($scope.serverLocation + "/roomtypeByFacility_Floor_zone?fkey=" + fac_key + "&floorkey=" + floor_key + "&zonekey=" + zonekey + "&OrganizationID=" + $scope.OrganizationID)
                    .success(function (response) {
                        // $ionicLoading.hide();
                        $scope.roomtypeList = response;
                        // console.log(JSON.stringify(response));
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
                $scope.myPromise = $http.get($scope.serverLocation + "/roomByFacility_Floor_zone?fkey=" + fac_key + "&floorkey=" + floor_key + "&zonekey=" + zonekey + "&OrganizationID=" + $scope.OrganizationID)
                    .success(function (response) {
                        // $ionicLoading.hide();
                        $scope.roomList = response;
                        // console.log(JSON.stringify(response));
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
                // $ionicLoading.hide();
            } else {
                $scope.myPromise = $http.get($scope.serverLocation + "/roomtypeByFacility_Zone?fkey=" + fac_key + "&zonekey=" + zonekey + "&OrganizationID=" + $scope.OrganizationID)
                    .success(function (response) {
                        // $ionicLoading.hide();
                        $scope.roomtypeList = response;
                        // console.log(JSON.stringify(response));
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
                $scope.myPromise = $http.get($scope.serverLocation + "/roomByFacility_Zone?fkey=" + fac_key + "&zonekey=" + zonekey + "&OrganizationID=" + $scope.OrganizationID)
                    .success(function (response) {
                        // $ionicLoading.hide();
                        $scope.roomList = response;
                        // console.log(JSON.stringify(response));
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
            }

        } else {
            $scope.changedFloor();
            return;
        }
    };
    $scope.changedRoomtype = function () {
        //Given either Facility , Floor , Zone and roomtype
        //Given either Facility , Floor and roomtype
        //Given either Facility , zone and roomtype
        //Given either Facility  and roomtype
        if ($scope.inspectionAdd.RoomTypeKey) {
            // $ionicLoading.show();
            var fac_key = $scope.inspectionAdd.FacilityKey.FacilityKey;
            var roomtype = $scope.inspectionAdd.RoomTypeKey.RoomTypeKey;
            if ($scope.inspectionAdd.FloorKey) {
                var floor = $scope.inspectionAdd.FloorKey.FloorKey;
                if ($scope.inspectionAdd.ZoneKey) {//Facility , Floor , Zone and roomtype
                    var zone = $scope.inspectionAdd.ZoneKey.ZoneKey;
                    $scope.myPromise = $http.get($scope.serverLocation + "/roomByFacility_Floor_Zone_RoomType?fkey=" + fac_key + "&floorkey=" + floor + "&zonekey=" + zone + "&roomtype=" + roomtype + "&OrganizationID=" + $scope.OrganizationID)
                        .success(function (response) {
                            // $ionicLoading.hide();
                            $scope.roomList = response;
                            // console.log(JSON.stringify(response));
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
                    // $ionicLoading.hide();
                } else {//Facility , Floor and roomtype
                    $scope.myPromise = $http.get($scope.serverLocation + "/roomByFacility_Floor_RoomType?fkey=" + fac_key + "&floorkey=" + floor + "&roomtype=" + roomtype + "&OrganizationID=" + $scope.OrganizationID)
                        .success(function (response) {
                            // $ionicLoading.hide();
                            $scope.roomList = response;
                            // console.log(JSON.stringify(response));
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
                    // $ionicLoading.hide();
                }
            } else {
                if ($scope.inspectionAdd.ZoneKey) {//Facility ,Zone and roomtype
                    var zone = $scope.inspectionAdd.ZoneKey.ZoneKey;
                    $scope.myPromise = $http.get($scope.serverLocation + "/roomByFacility_Zone_RoomType?fkey=" + fac_key + "&zonekey=" + zone + "&roomtype=" + roomtype + "&OrganizationID=" + $scope.OrganizationID)
                        .success(function (response) {
                            // $ionicLoading.hide();
                            $scope.roomList = response;
                            // console.log(JSON.stringify(response));
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
                    // $ionicLoading.hide();
                } else {//Facility  and roomtype
                    $scope.myPromise = $http.get($scope.serverLocation + "/roomByFacility_RoomType?fkey=" + fac_key + "&roomtype=" + roomtype + "&OrganizationID=" + $scope.OrganizationID)
                        .success(function (response) {
                            // $ionicLoading.hide();
                            $scope.roomList = response;
                            // console.log(JSON.stringify(response));
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
                    // $ionicLoading.hide();
                }
            }
        }
        else {
            $scope.changedZone();
            // $ionicLoading.hide();
            return;
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


    //Date-time picker

    $scope.today_DT = convert_DT(new Date());

    var ipObj1 = {
        callback: function (val) {      //Mandatory
            if (typeof (val) === 'undefined') {
                // console.log('Time not selected');
            } else {
                var selectedTime = new Date(val * 1000);
                $scope.showTimePicker = false;
                // console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
                $scope.timeValue = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();

            }
        },
        inputTime: 60 * (new Date).getHours() * 60 + 60 * (new Date).getMinutes(),
        // inputTime: 50400,   //Optional
        format: 12,         //Optional
        step: 5,           //Optional
        setLabel: 'Save'    //Optional
    };
    $scope.showTimePicker = false;
    $scope.callTimePicker = function () {
        ionicTimePicker.openTimePicker(ipObj1);
        $scope.showTimePicker = true;
    };
    var ipObj2 = {
        callback: function (val) {  //Mandatory
            // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.dateValue = convert_DT(new Date(val));
            if ($scope.inspectionAdd.EmployeeKey) {
                // console.log(convert_DT($scope.dateValue));
                $scope.workorderList = [];
                $scope.inspectionAdd.inspectiondate = convert_DT($scope.dateValue);
                var employeekey = $scope.inspectionAdd.EmployeeKey.EmployeeKey;
                $scope.myPromise = $http.get($scope.serverLocation + "/allWorkordersByEmployeeKey?viewdate=" + $scope.inspectionAdd.inspectiondate + "&employeekey=" + employeekey + "&OrganizationID=" + $scope.OrganizationID)
                    .success(function (response) {
                        if (response.length > 0) {
                            $scope.workorderList = response;
                            $scope.showWorkorder = true;
                        }
                        else {
                            $scope.showWorkorder = false;
                        }
                        // console.log(JSON.stringify(response));
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
            }
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
    //
});
