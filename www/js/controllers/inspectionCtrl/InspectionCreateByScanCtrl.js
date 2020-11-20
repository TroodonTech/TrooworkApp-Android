myApp.controller('InspectionCreateByScanCtrl', function (HOSTNAME, $cordovaFile, $ionicActionSheet, $cordovaFileTransfer, $scope, $ionicModal, $ionicSlideBoxDelegate, $stateParams, $cordovaCamera, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicPlatform, $cordovaBarcodeScanner, $ionicLoading, $interval) {

    var token = window.localStorage.getItem('token');
    $window.localStorage['token'] = token;
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(url_base64_decode(encodedProfile));
    // console.log("INSIDE WORKORDERDETAILS...."+profile);
    $scope.toServeremployeekey = profile.employeekey;
    $scope.isSupervisor = profile.IsSupervisor;
    $scope.OrganizationID = profile.OrganizationID;
    $scope.roomDetails = {};
    $scope.scrollMainToTop = function () {
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    };
    $scope.scrollSmallToTop = function () {
        $ionicScrollDelegate.$getByHandle('small').scrollTop();
    };
    $scope.inspectionAdd = {};
    $scope.isDoubleScanDisabled = true;
    $scope.scannedBarcode = $stateParams.roomKey;
    console.log("barcode  **" + $scope.scannedBarcode);
    $scope.isBarcodeRequired = true;
    $scope.auditSupKey = parseInt($scope.toServeremployeekey);
    function convert_DT(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    if ($scope.scannedBarcode) {

        $scope.myPromise = $http.get(HOSTNAME + "/getTemplatesNameFor_pick_Mob?employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                $scope.templateList = response;
                console.log("templateList name " + $scope.templateList[0].TemplateName);
                // console.log(JSON.stringify(response));
            });

        $scope.myPromise = $http.get(HOSTNAME + "/roomDetailsFromBarcode_mob?empkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&scannedBarcode=" + $scope.scannedBarcode)
            .success(function (response) {
                // $ionicLoading.hide();
                $scope.roomDetails = response;
                // console.log($scope.employees);
            });




        $scope.myPromise = $http.get(HOSTNAME + "/mob_supervisorname?employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                $scope.supervisorName = response;
                // console.log(JSON.stringify(response));
            });
        $scope.myPromise = $http.get(HOSTNAME + "/mob_allemployees?empkey=" + $rootScope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                // $ionicLoading.hide();
                $scope.employeeListManagerView = response;
                // console.log($scope.employeeListManagerView);
            });
    }

    $scope.createInspection = function (TemplateID, SupervisorKey, EmployeeKey) {
        if (!TemplateID) {

            $ionicPopup.alert({
                title: 'Submit failed',
                template: 'Template name is not provided!'
            });
            return;
        }

        if (!SupervisorKey) {

            $ionicPopup.alert({
                title: 'Submit failed',
                template: 'Auditor name is not provided!'
            });
            return;
        }
        // var metaUpdatedBy = $scope.toServeremployeekey;


        if (!EmployeeKey) {

            EmployeeKey = -1;
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

        $scope.myPromise = $http.get(HOSTNAME + "/mob_createInspectionByScan?barcode=" + $scope.scannedBarcode + "&TemplateID=" + TemplateID + "&SupervisorKey=" + SupervisorKey + "&EmployeeKey=" + EmployeeKey + "&time=" + p + "&metaUser=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (res) {

                $rootScope.inspectKey = res[0].InspectionOrderKey;
                $rootScope.templID = TemplateID;
                var alertPopup = $ionicPopup.alert({
                    title: 'Inspection',
                    template: 'Inspection has been Created!'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                    alertPopup.close();
                    // uploadingPopup.close();
                    console.log("role " + profile.role);
                    if (profile.role == 'Supervisor') {
                        $state.go('supervisorDashboard.inspectionDetails');
                    }
                    else if (profile.role == 'Manager') {
                        $state.go('managerDashboard.inspectionDetails');
                    }

                }, 1000);
                console.log("inspkey*******" + res[0].InspectionOrderKey);
            });

    }


    $scope.toggleButton = function (isBarcodeRequired) {
        console.log("isBarcodeRequired  " + isBarcodeRequired);
        $scope.isBarcodeRequired = isBarcodeRequired;
    }

    $scope.createInspectionByBarcode = function () {
        if ($scope.isDoubleScanDisabled) {
            $ionicPlatform.ready(function () {
                //alert('Platform ready');
                window.plugins.flashlight.switchOn();
                $cordovaBarcodeScanner.scan().then(function (result) {
                    // alert();
                    // Success! Barcode data is here

                    $scope.scanResults = "We got a barcoden" +
                        "Result: " + result.text + "n" +
                        "Format: " + result.format + "n" +
                        "Cancelled: " + result.cancelled;
                    $scope.scannedBarcode = result.text;
                    console.log("barcode*******" + $scope.scannedBarcode);
                    window.plugins.flashlight.switchOff();
                    if ($scope.scannedBarcode) {
                        $scope.myPromise = $http.get(HOSTNAME + "/checkRoomWorkorderCreateByEmployeeBarcode?barcode=" + $scope.scannedBarcode + "&emp=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
                            .success(function (check) {
                                if (check[0].count > 0) {
                                    $scope.isDoubleScanDisabled = true;
                                    console.log("role " + profile.role);
                                    if (profile.role == 'Supervisor') {
                                        $state.go('supervisorDashboard.scanRoomForCreateInspDetailPage', { roomKey: $scope.scannedBarcode });
                                    }
                                    else if (profile.role == 'Manager') {
                                        $state.go('managerDashboard.scanRoomForCreateInspDetailPage', { roomKey: $scope.scannedBarcode });
                                    }
                                }
                                else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Invalid Barcode',
                                        template: 'Please, try again!'
                                    });
                                    $timeout(function () {
                                        $ionicLoading.hide();
                                        alertPopup.close();
                                        // uploadingPopup.close();
                                    }, 1000);
                                }
                            })
                    }
                }, function (error) {
                    // An error occurred
                    $scope.scanResults = 'Error: ' + error;
                });

            });
        }
        $scope.isDoubleScanDisabled = false;
    }
    document.addEventListener("backbutton", function () {
        // pass exitApp as callbacks to the switchOff method
        window.plugins.flashlight.switchOff();
    }, false);
});
