//controller for view all workorder ->manager
myApp.controller('workorderController', function (HOSTNAME, $scope, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicActionSheet, $ionicPlatform, $ionicModal, $ionicLoading, ionicTimePicker, ionicDatePicker) {
    var token = window.localStorage.getItem('token');
    $window.localStorage['token'] = token;
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(url_base64_decode(encodedProfile));
    // console.log(profile);
    $scope.toServeremployeekey = profile.employeekey;
    $scope.OrganizationID = profile.OrganizationID;
    // alert(empKey);
    // console.log("INSIDE WorkOrderFilteringByFacilityCtrl");
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
    function convert_DT_addOneDay(str) {// reduce one day for display
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
    $scope.dateValue = convert_DT(new Date());
    $scope.timeValue = new Date().getHours() + ':' + new Date().getMinutes();


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


    $scope.workorderCreation = {};
    $scope.serverLocation = HOSTNAME;
    $scope.workorderCreation.showEqTypes = false;

    $scope.showEqTypesFun = function () {
        console.log("Equipment " + $scope.workorderCreation.showEqTypes);
    }

    $scope.createWorkorder = function () {
        if ($scope.workorderCreation.showEqTypes == false) {
            $scope.createWorkorder1();
            console.log("Equipment***Not " + $scope.workorderCreation.showEqTypes);

        } else {
            console.log("Equipment*** " + $scope.workorderCreation.showEqTypes);
            $scope.createWorkorder2();

        }
    }

    $scope.createWorkorder1 = function () {
        console.log("Equipment***Not");
        // console.log($scope.workorderCreation);
        var roomlistObj = [];
        var roomtypelistObj = [];
        var zonelistObj = [];
        var floorlistObj = [];
        var facilitylistObj = [];
        var facilityList = [];
        var roomList = [];
        var roomtypeList = [];
        var zoneList = [];
        var floorList = [];
        facilitylistObj = $scope.facilityList;
        floorlistObj = $scope.floorList;
        zonelistObj = $scope.zoneList;
        roomtypelistObj = $scope.roomtypeList;
        roomlistObj = $scope.roomList;
        var wot;
        var notes;
        var facilityString;
        var zone;
        var eqp_key;
        var shift;
        var emp_key;
        var priority;
        var isReccuring;
        var isrecurring; //for setting bit value 1 or 0
        var startDT;
        var endDT;
        var workTime;
        var dailyRecc_gap; //dailyreccuringGap
        var isPhotoRequired;
        var isBarcodeRequired;
        var isSnapshotRequired;
        //        /* new fields for the new procedure aand their values
        $scope.workorderCreation.intervaltype = '0'; // char(1),/*d for day, w for week, m for month*/
        $scope.workorderCreation.repeatinterval = 1; // int,/*daily(every `2` days) weekly(every `1` week) monthly(every `3` months)*/
        var occurenceinstance = null; // int,/*daily(3) weekly(null) monthly(null) monthly(1)*/
        $scope.workorderCreation.occursonday = null; // varchar(255),/*daily(null) weekly('mon,thu,fri') monthly(day '6') monthly('thu')*/


        if ($scope.workorderCreation.WorkorderTypeKey) {
            wot = $scope.workorderCreation.WorkorderTypeKey.WorkorderTypeKey;
        } else {
            wot = null;
            //            $scope.newworkorderError = "WorkorderTypeKey is not provided !";
            // $scope.newworkorder.newworkorderError = "WorkorderType is not provided !";
            var alertPopup = $ionicPopup.alert({
                title: 'Workorder Creation',
                template: 'Workorder Type is not provided!'
            });
            return;
        }

        if ($scope.workorderCreation.workorderNotes) {
            notes = $scope.workorderCreation.workorderNotes;
        } else {
            notes = null;
        }
        // alert("notes "+notes);
        // debugger;
        if (!$scope.workorderCreation.FacilityKey) {

            var alertPopup = $ionicPopup.alert({
                title: 'Workorder Creation',
                template: 'Building  is not provided!'
            });
            return;
        }
        if (!$scope.workorderCreation.FloorKey) {

            var alertPopup = $ionicPopup.alert({
                title: 'Workorder Creation',
                template: 'Floor  is not provided!'
            });
            return;
        }

        var roomsString;
        if ($scope.workorderCreation.RoomKey) {
            roomsString = $scope.workorderCreation.RoomKey.RoomKey;
        } else {
            if (roomlistObj) {
                for (var j = 0; j < roomlistObj.length; j++) {
                    roomList.push(roomlistObj[j].RoomKey);
                }
                roomsString = roomList.join(',');
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Workorder Creation',
                    template: 'Room has no value!'
                });

                return;
            }
        }

        var facilityString;
        if ($scope.workorderCreation.FacilityKey) {
            facilityString = $scope.workorderCreation.FacilityKey.FacilityKey;
        } else {
            if (facilitylistObj) {
                for (var j = 0; j < facilitylistObj.length; j++) {
                    facilityList.push(facilitylistObj[j].FacilityKey);
                }
                facilityString = facilityList.join(',');
            }
        }
        var floorString;
        if ($scope.workorderCreation.FloorKey) {
            floorString = $scope.workorderCreation.FloorKey.FloorKey;
        } else {
            if (floorlistObj) {
                for (var j = 0; j < floorlistObj.length; j++) {
                    floorList.push(floorlistObj[j].FloorKey);
                }
                floorString = floorList.join(',');
            }
        }
        var zoneString;
        if ($scope.workorderCreation.ZoneKey) {
            zoneString = $scope.workorderCreation.ZoneKey.ZoneKey;
        } else {
            zone = null;
            if (zonelistObj) {
                for (var j = 0; j < zonelistObj.length; j++) {
                    zoneList.push(zonelistObj[j].ZoneKey);
                }
                zoneString = zoneList.join(',');
            }
        }
        var roomtypeString;
        if ($scope.workorderCreation.RoomTypeKey) {
            roomtypeString = $scope.workorderCreation.RoomTypeKey.RoomTypeKey;
        } else {
            if (roomtypelistObj) {
                for (var j = 0; j < roomtypelistObj.length; j++) {
                    roomtypeList.push(roomtypelistObj[j].RoomTypeKey);
                }
                roomtypeString = roomtypeList.join(',');
            }
        }
        //                console.log("facilitylist "+facilityString+" floorlist "+floorString+" zonelist "+zoneString+" roomtypelist "+roomtypeString+" roomlist "+roomsString);
        //        alert("floor list obt  " + floorString);
        if ($scope.workorderCreation.EquipmentKey) {
            eqp_key = $scope.workorderCreation.EquipmentKey.EquipmentKey;
        } else {
            eqp_key = - 1;
        }

        //        alert("equip key " + eqp_key);
        if ($scope.workorderCreation.ShiftTypeKey) {
            shift = $scope.workorderCreation.ShiftTypeKey.ShiftTypeKey;
        } else {
            shift = null;
        }

        if ($scope.workorderCreation.EmployeeKey) {
            emp_key = $scope.workorderCreation.EmployeeKey.EmployeeKey;
        } else {
            emp_key = - 1; //Assigning to a default employee.

        }
        if ($scope.workorderCreation.ZoneKey) {
            zone = $scope.workorderCreation.ZoneKey.ZoneKey;
        } else {
            zone = null; //Assigning to a default employee.

        }
        if (emp_key === - 1 && shift !== null && zone === null) {
            //                  $scope.newworkorderError = "Please provide Zone while employee shift is used !";
            //                  $scope.newworkorder.newworkorderError = "Please provide Zone while employee shift is used !";
            var alertPopup = $ionicPopup.alert({
                title: 'Workorder Creation',
                template: 'Please provide Zone while employee and shift is used !'
            });
            return;
        }

        if ($scope.workorderCreation.PriorityKey) {
            priority = $scope.workorderCreation.PriorityKey.PriorityKey;
        } else {
            priority = - 1; //seting a default priority value
            //                  $scope.newworkorderError = "Priority is not provided !";
        }
        if ($scope.workorderCreation.isPhotoRequired) {
            isPhotoRequired = 1;
        } else {
            isPhotoRequired = 0;
        }
        if ($scope.workorderCreation.isBarcodeRequired) {
            isBarcodeRequired = 1;
        } else {
            isBarcodeRequired = 0;
        }

        if ($scope.workorderCreation.isSnapshotRequired) {
            isSnapshotRequired = 1;
        } else {
            isSnapshotRequired = 0;
        }


        isReccuring = false;
        isrecurring = 0;

        //        alert("checkbox vale" + isReccuring);

        // debugger;
        if ($scope.dateValue) {
            // alert("startdate vale" + $scope.dateValue);
            startDT = convert_DT_addOneDay($scope.dateValue);
        } else {

            startDT = convert_DT_addOneDay(new Date());
            //                  $scope.newworkorderError = "Start date is not provided !";
            //                   $scope.clickToOpen("Start date is not provided !");
            //                   return;
        }
        endDT = startDT;
        // alert("startdate vale" + startDT);
        if ($scope.timeValue) {
            workTime = $scope.timeValue;
            //                    console.log("workorder time orig  " + workTime);

            //                    console.log("workorder time parsed  " + workTime);
        }
        else {

            $scope.timeValue = new Date().getHours() + ':' + new Date().getMinutes();
            workTime = to24Hour($scope.timeValue);


        }

        $scope.workorderCreation.occursontime = workTime;
        $scope.workorderCreation.workorderkey = - 99;
        $scope.workorderCreation.workordertypekey = wot;
        $scope.workorderCreation.workordernote = notes;
        $scope.workorderCreation.equipmentkey = -1;
        $scope.workorderCreation.roomkeys = roomsString;
        $scope.workorderCreation.facilitykeys = facilityString;
        $scope.workorderCreation.floorkeys = floorString;
        $scope.workorderCreation.zonekeys = zoneString;
        $scope.workorderCreation.roomtypekeys = roomtypeString;
        $scope.workorderCreation.employeekey = emp_key;
        $scope.workorderCreation.priority = priority;
        $scope.workorderCreation.fromdate = startDT;
        $scope.workorderCreation.todate = endDT;
        $scope.workorderCreation.isbar = isBarcodeRequired;
        $scope.workorderCreation.isphoto = isPhotoRequired;
        $scope.workorderCreation.IsSnapshot = isSnapshotRequired;
        $scope.workorderCreation.keepActive = 0;
        // isSnapshotRequired
        console.log("Snapshot" + isSnapshotRequired);
        $scope.workorderCreation.metaupdatedby = $scope.toServeremployeekey;
        $scope.workorderCreation.OrganizationID = $scope.OrganizationID;
        // console.log($scope.workorderCreation);
        // alert("workordernote "+$scope.workorderCreation.workordernote);
        // alert("startdate vale" + $scope.workorderCreation.fromdate+".."+$scope.workorderCreation.todate);
        // $scope.myPromise = $http.post(HOSTNAME +"/addNewWorkorder",$scope.workorderCreation)
        $scope.myPromise = $http.post(HOSTNAME + "/addNewWorkorder", $scope.workorderCreation)
            .success(function (response) {
                $scope.scrollToTop();
                $scope.workorderCreation.WorkorderTypeKey = null;
                $scope.workorderCreation.workorderNotes = null;
                $scope.workorderCreation.FacilityKey = null;
                $scope.workorderCreation.RoomKey = null;
                $scope.workorderCreation.FloorKey = null;
                $scope.workorderCreation.ZoneKey = null;
                $scope.workorderCreation.RoomTypeKey = null;
                $scope.workorderCreation.EquipmentKey = null;
                $scope.workorderCreation.EquipmentTypeKey = null;
                $scope.workorderCreation.RoomTypeKey = null;
                $scope.workorderCreation.PriorityKey = null;
                $scope.workorderCreation.ShiftTypeKey = null;
                $scope.workorderCreation.EmployeeKey = null;
                $scope.workorderCreation.isPhotoRequired = false;
                $scope.workorderCreation.isBarcodeRequired = false;
                $scope.workorderCreation.isSnapshotRequired = false;
                $scope.workorderCreation.$scope.wo = false;
                //   isSnapshotRequired
                $scope.scrollToTop();
                var alertPopup = $ionicPopup.alert({
                    title: 'Successfully Added!'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    // uploadingPopup.close();
                }, 1000);
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
        // $scope.myPromise = $http.post(HOSTNAME + "/addNewWorkorder",$scope.workorderCreation)
        //          .success(function(response)
        //          {
        //            // $ionicLoading.hide();
        //              // $scope.workorderCreation = null;
        //              // console.log($scope.employees);
        //          })
        //          .error(function(error){
        //                var alertPopup = $ionicPopup.alert({
        //                       title: 'Something went Wrong',
        //                       template: 'Please relogin!'
        //                                                 });
        //      });

    };

    $scope.createWorkorder2 = function () {
        console.log("Equipment***");
        var roomlistObj = [];
        var roomtypelistObj = [];
        var zonelistObj = [];
        var floorlistObj = [];
        var facilitylistObj = [];
        var facilityList = [];
        var roomList = [];
        var roomtypeList = [];
        var zoneList = [];
        var floorList = [];
        facilitylistObj = $scope.facilityList;
        floorlistObj = $scope.floorList;
        zonelistObj = $scope.zoneList;
        roomtypelistObj = $scope.roomtypeList;
        roomlistObj = $scope.roomList;
        var wot;
        var notes;
        var facilityString;
        var zone;
        var eqp_key;
        var shift;
        var emp_key;
        var priority;
        var isReccuring;
        var isrecurring; //for setting bit value 1 or 0
        var startDT;
        var endDT;
        var workTime;
        var dailyRecc_gap; //dailyreccuringGap
        var isPhotoRequired;
        var isBarcodeRequired;
        var isSnapshotRequired;
        //        /* new fields for the new procedure aand their values
        $scope.workorderCreation.intervaltype = '0'; // char(1),/*d for day, w for week, m for month*/
        $scope.workorderCreation.repeatinterval = 1; // int,/*daily(every `2` days) weekly(every `1` week) monthly(every `3` months)*/
        var occurenceinstance = null; // int,/*daily(3) weekly(null) monthly(null) monthly(1)*/
        $scope.workorderCreation.occursonday = null; // varchar(255),/*daily(null) weekly('mon,thu,fri') monthly(day '6') monthly('thu')*/


        if ($scope.workorderCreation.WorkorderTypeKey) {
            wot = $scope.workorderCreation.WorkorderTypeKey.WorkorderTypeKey;
        } else {
            wot = null;
            //            $scope.newworkorderError = "WorkorderTypeKey is not provided !";
            // $scope.newworkorder.newworkorderError = "WorkorderType is not provided !";
            var alertPopup = $ionicPopup.alert({
                title: 'Workorder Creation',
                template: 'Workorder Type is not provided!'
            });
            return;
        }

        if ($scope.workorderCreation.workorderNotes) {
            notes = $scope.workorderCreation.workorderNotes;
        } else {
            notes = null;
        }
        // alert("notes "+notes);
        // debugger;
        if (!$scope.workorderCreation.FacilityKey) {

            var alertPopup = $ionicPopup.alert({
                title: 'Workorder Creation',
                template: 'Building  is not provided!'
            });
            return;
        }
        if (!$scope.workorderCreation.FloorKey) {

            var alertPopup = $ionicPopup.alert({
                title: 'Workorder Creation',
                template: 'Floor  is not provided!'
            });
            return;
        }

        var roomsString;
        // if ($scope.workorderCreation.RoomKey) {
        //     roomsString = $scope.workorderCreation.RoomKey.RoomKey;
        // } else {
        // if (roomlistObj) {
        //     for (var j = 0; j < roomlistObj.length; j++) {
        //         roomList.push(roomlistObj[j].RoomKey);
        //     }
        //     roomsString = roomList.join(',');
        // } else {
        //   var alertPopup = $ionicPopup.alert({
        //      title: 'Workorder Creation',
        //      template: 'Room has no value!'
        //                                });

        //      return;
        // }
        roomsString = -1;
        // }

        var facilityString;
        if ($scope.workorderCreation.FacilityKey) {
            facilityString = $scope.workorderCreation.FacilityKey.FacilityKey;
        } else {
            if (facilitylistObj) {
                for (var j = 0; j < facilitylistObj.length; j++) {
                    facilityList.push(facilitylistObj[j].FacilityKey);
                }
                facilityString = facilityList.join(',');
            }
        }
        var floorString;
        if ($scope.workorderCreation.FloorKey) {
            floorString = $scope.workorderCreation.FloorKey.FloorKey;
        } else {
            if (floorlistObj) {
                for (var j = 0; j < floorlistObj.length; j++) {
                    floorList.push(floorlistObj[j].FloorKey);
                }
                floorString = floorList.join(',');
            }
        }
        var zoneString;
        if ($scope.workorderCreation.ZoneKey) {
            zoneString = $scope.workorderCreation.ZoneKey.ZoneKey;
        } else {
            zone = null;
            if (zonelistObj) {
                for (var j = 0; j < zonelistObj.length; j++) {
                    zoneList.push(zonelistObj[j].ZoneKey);
                }
                zoneString = zoneList.join(',');
            }
        }
        var roomtypeString;
        if ($scope.workorderCreation.RoomTypeKey) {
            roomtypeString = $scope.workorderCreation.RoomTypeKey.RoomTypeKey;
        } else {
            if (roomtypelistObj) {
                for (var j = 0; j < roomtypelistObj.length; j++) {
                    roomtypeList.push(roomtypelistObj[j].RoomTypeKey);
                }
                roomtypeString = roomtypeList.join(',');
            }
        }
        //                console.log("facilitylist "+facilityString+" floorlist "+floorString+" zonelist "+zoneString+" roomtypelist "+roomtypeString+" roomlist "+roomsString);
        //        alert("floor list obt  " + floorString);
        if ($scope.workorderCreation.EquipmentKey) {
            eqp_key = $scope.workorderCreation.EquipmentKey.EquipmentKey;
        } else {
            var EquListObj = $scope.equipmentList;
            var equList = [];
            if (EquListObj) {
                for (var j = 0; j < EquListObj.length; j++) {
                    equList.push(EquListObj[j].EquipmentKey);
                }
                eqp_key = equList.join(',');
            }

        }

        //        alert("equip key " + eqp_key);
        if ($scope.workorderCreation.ShiftTypeKey) {
            shift = $scope.workorderCreation.ShiftTypeKey.ShiftTypeKey;
        } else {
            shift = null;
        }

        if ($scope.workorderCreation.EmployeeKey) {
            emp_key = $scope.workorderCreation.EmployeeKey.EmployeeKey;
        } else {
            emp_key = - 1; //Assigning to a default employee.

        }
        if ($scope.workorderCreation.ZoneKey) {
            zone = $scope.workorderCreation.ZoneKey.ZoneKey;
        } else {
            zone = null; //Assigning to a default employee.

        }
        if (emp_key === - 1 && shift !== null && zone === null) {
            //                  $scope.newworkorderError = "Please provide Zone while employee shift is used !";
            //                  $scope.newworkorder.newworkorderError = "Please provide Zone while employee shift is used !";
            var alertPopup = $ionicPopup.alert({
                title: 'Workorder Creation',
                template: 'Please provide Zone while employee and shift is used !'
            });
            return;
        }

        if ($scope.workorderCreation.PriorityKey) {
            priority = $scope.workorderCreation.PriorityKey.PriorityKey;
        } else {
            priority = - 1; //seting a default priority value
            //                  $scope.newworkorderError = "Priority is not provided !";
        }
        if ($scope.workorderCreation.isPhotoRequired) {
            isPhotoRequired = 1;
        } else {
            isPhotoRequired = 0;
        }
        if ($scope.workorderCreation.isBarcodeRequired) {
            isBarcodeRequired = 1;
        } else {
            isBarcodeRequired = 0;
        }

        if ($scope.workorderCreation.isSnapshotRequired) {
            isSnapshotRequired = 1;
        } else {
            isSnapshotRequired = 0;
        }



        isReccuring = false;
        isrecurring = 0;

        //        alert("checkbox vale" + isReccuring);

        // debugger;
        if ($scope.dateValue) {
            // alert("startdate vale" + $scope.dateValue);
            startDT = convert_DT_addOneDay($scope.dateValue);
            console.log("Value of passed date:" + $scope.dateValue);
            console.log("Value of start date" + startDT);
        } else {

            startDT = convert_DT_addOneDay(new Date());
            //console.log("Value of passed date:"+$scope.dateValue);
            console.log("Value of start date" + startDT);
            //                  $scope.newworkorderError = "Start date is not provided !";
            //                   $scope.clickToOpen("Start date is not provided !");
            //                   return;
        }
        endDT = startDT;
        // alert("startdate vale" + startDT);
        if ($scope.timeValue) {
            workTime = $scope.timeValue;
            //                    console.log("workorder time orig  " + workTime);

            //                    console.log("workorder time parsed  " + workTime);
        }
        else {

            $scope.timeValue = new Date().getHours() + ':' + new Date().getMinutes();
            workTime = to24Hour($scope.timeValue);


        }

        $scope.workorderCreation.occursontime = workTime;
        $scope.workorderCreation.workorderkey = - 99;
        $scope.workorderCreation.workordertypekey = wot;
        $scope.workorderCreation.workordernote = notes;
        $scope.workorderCreation.equipmentkey = eqp_key;
        $scope.workorderCreation.roomkeys = roomsString;
        $scope.workorderCreation.facilitykeys = facilityString;
        $scope.workorderCreation.floorkeys = floorString;
        $scope.workorderCreation.zonekeys = zoneString;
        $scope.workorderCreation.roomtypekeys = roomtypeString;
        $scope.workorderCreation.employeekey = emp_key;
        $scope.workorderCreation.priority = priority;
        $scope.workorderCreation.fromdate = startDT;
        $scope.workorderCreation.todate = endDT;
        $scope.workorderCreation.isbar = isBarcodeRequired;
        $scope.workorderCreation.IsSnapshot = isSnapshotRequired;
        console.log("Snapshot" + isSnapshotRequired);
        // isSnapshotRequired;
        $scope.workorderCreation.isphoto = isPhotoRequired;
        $scope.workorderCreation.metaupdatedby = $scope.toServeremployeekey;
        $scope.workorderCreation.OrganizationID = $scope.OrganizationID;
        $scope.workorderCreation.keepActive = 0;
        console.log("roomsString  " + roomsString);
        // alert("workordernote "+$scope.workorderCreation.workordernote);
        // alert("startdate vale" + $scope.workorderCreation.fromdate+".."+$scope.workorderCreation.todate);
        $scope.myPromise = $http.post(HOSTNAME + "/addworkorderwithEquipment", $scope.workorderCreation)
            .success(function (response) {
                $scope.scrollToTop();
                $scope.workorderCreation.WorkorderTypeKey = null;
                $scope.workorderCreation.workorderNotes = null;
                $scope.workorderCreation.FacilityKey = null;
                $scope.workorderCreation.RoomKey = null;
                $scope.workorderCreation.FloorKey = null;
                $scope.workorderCreation.ZoneKey = null;
                $scope.workorderCreation.RoomTypeKey = null;
                $scope.workorderCreation.EquipmentKey = null;
                $scope.workorderCreation.EquipmentTypeKey = null;
                $scope.workorderCreation.RoomTypeKey = null;
                $scope.workorderCreation.PriorityKey = null;
                $scope.workorderCreation.ShiftTypeKey = null;
                $scope.workorderCreation.EmployeeKey = null;
                $scope.workorderCreation.isPhotoRequired = false;
                $scope.workorderCreation.isBarcodeRequired = false;
                $scope.workorderCreation.isSnapshotRequired = false;
                $scope.scrollToTop();
                var alertPopup = $ionicPopup.alert({
                    title: 'Successfully Added!'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    // uploadingPopup.close();
                }, 1000);
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
        // $scope.myPromise = $http.post(HOSTNAME + "/addNewWorkorder",$scope.workorderCreation)
        //          .success(function(response)
        //          {
        //            // $ionicLoading.hide();
        //              // $scope.workorderCreation = null;
        //              // console.log($scope.employees);
        //          })
        //          .error(function(error){
        //                var alertPopup = $ionicPopup.alert({
        //                       title: 'Something went Wrong',
        //                       template: 'Please relogin!'
        //                                                 });
        //      });

    };

    $scope.myPromise = $http.get(HOSTNAME + "/mob_allWorkordertype?empkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
            // $ionicLoading.hide();
            $scope.workorderTypes = response;
            // console.log($scope.employees);
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
    // $scope.myPromise = $http.get($scope.serverLocation +"/allequiptype?employeekey="+$scope.toServeremployeekey+"&OrganizationID="+$scope.OrganizationID)
    //         .success(function (response)

    //         {
    //             $scope.equipmentTypeList = response;
    //             console.log(JSON.stringify(response));
    //         })
    //         .error(function(error){
    //           var alertPopup = $ionicPopup.alert({
    //                  title: 'Something went Wrong',
    //                  template: 'Please relogin!'
    //                                            });
    //            $timeout(function() {
    //                         $ionicLoading.hide();
    //                               alertPopup.close();
    //                               // uploadingPopup.close();
    //                            }, 1000);
    // });
    $scope.myPromise = $http.get($scope.serverLocation + "/allshifttype?OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
            $scope.shiftTypeList = response;
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
    $scope.myPromise = $http.get($scope.serverLocation + "/mob_allpriority?OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
            $scope.priorityList = response;
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
            $scope.employeeList = response;
            console.log($scope.employeeList);
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


    $scope.selectDomainEquipmenttype = function (domain, key) {
        $scope.myPromise = $http.get($scope.serverLocation + "/getEquipmentEquTypeChange?FacilityKey=" + $scope.workorderCreation.FacilityKey.FacilityKey + "&FloorKey=" + $scope.workorderCreation.FloorKey.FloorKey + "&EquipmentTypeKey=" + $scope.workorderCreation.EquipmentTypeKey.EquipmentTypeKey + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                $scope.equipmentList = response;
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



    $scope.changedWOT = function () {
        var woList = [];
        woList = $scope.workorderTypes;
        var index = 0;
        $scope.workorderCreation.showEqTypes = false;
        woList.forEach(function (data) {
            if (data.WorkorderTypeText == 'Equipment' && data.WorkorderTypeKey == $scope.workorderCreation.WorkorderTypeKey.WorkorderTypeKey) {
                $scope.workorderCreation.showEqTypes = true;

            } else {
                $scope.workorderCreation.EquipmentKey = null;
                $scope.workorderCreation.EquipmentTypeKey = null;
            }
            index++;
        });
        if ($scope.workorderCreation.FacilityKey) {
            var fac_key = $scope.workorderCreation.FacilityKey.FacilityKey;
            var domain = 'facilities';
            // console.log(fac_key);
            // $ionicLoading.show();
            $scope.myPromise = $http.get($scope.serverLocation + "/domainvaluesByKey?domain=" + domain + "&key=" + fac_key + "&OrganizationID=" + $scope.OrganizationID).success(function (response) {
                // $ionicLoading.hide();
                $scope.floorList = response;
                $scope.zoneList = response;
                $scope.roomtypeList = response;
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
        else {
            // $ionicLoading.hide();
            $scope.floorList = null;
            $scope.zoneList = null;
            $scope.roomtypeList = null;
            $scope.roomList = null;
            return;
        }
    };



    $scope.selectedFacility = function () {

        if ($scope.workorderCreation.FacilityKey) {
            var fac_key = $scope.workorderCreation.FacilityKey.FacilityKey;
            var domain = 'facilityOnly';
            // console.log(fac_key);
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
    $scope.changedFloor = function () {
        //Facility and floor are given
        if ($scope.workorderCreation.FloorKey) {
            // $ionicLoading.show();
            var fac_key = $scope.workorderCreation.FacilityKey.FacilityKey;
            var floor_key = $scope.workorderCreation.FloorKey.FloorKey;
            // console.log(fac_key+" Floor key " + floor_key);
            $scope.myPromise = $http.get($scope.serverLocation + "/getEquipmentBuildFloor?FacilityKey=" + fac_key + "&FloorKey=" + floor_key + "&OrganizationID=" + $scope.OrganizationID)
                .success(function (response) {
                    // $ionicLoading.hide();
                    $scope.equipmentTypeList = response;
                    $scope.equipmentList = response;
                    // console.log(JSON.stringify(response));
                })
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

        if ($scope.workorderCreation.ZoneKey) {
            // $ionicLoading.show();
            var fac_key = $scope.workorderCreation.FacilityKey.FacilityKey;
            var zonekey = $scope.workorderCreation.ZoneKey.ZoneKey;

            if ($scope.workorderCreation.FloorKey) {
                var floor_key = $scope.workorderCreation.FloorKey.FloorKey;
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
        if ($scope.workorderCreation.RoomTypeKey) {
            // $ionicLoading.show();
            var fac_key = $scope.workorderCreation.FacilityKey.FacilityKey;
            var roomtype = $scope.workorderCreation.RoomTypeKey.RoomTypeKey;
            // console.log(fac_key+".."+roomtype);
            if ($scope.workorderCreation.FloorKey) {
                var floor = $scope.workorderCreation.FloorKey.FloorKey;
                if ($scope.workorderCreation.ZoneKey) {//Facility , Floor , Zone and roomtype
                    var zone = $scope.workorderCreation.ZoneKey.ZoneKey;
                    // console.log(floor+".."+zone);
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
            }
            else {
                if ($scope.workorderCreation.ZoneKey) {//Facility ,Zone and roomtype
                    var zone = $scope.workorderCreation.ZoneKey.ZoneKey;
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
                } else {
                    //Facility  and roomtype
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
                $scope.workorderCreation.workorderTime = $scope.timeValue;
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
});
