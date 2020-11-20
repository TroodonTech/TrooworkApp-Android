myApp.controller('createWorkOrderbyRoomScaning', function (HOSTNAME, $cordovaFile, $ionicActionSheet, $cordovaFileTransfer, $scope, $ionicModal, $ionicSlideBoxDelegate, $stateParams, $cordovaCamera, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicPlatform, $cordovaBarcodeScanner, $ionicLoading, $interval) {

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

    $scope.scannedBarcode = $stateParams.roomKey;
    console.log("barcode  **" + $scope.scannedBarcode);
    $scope.isBarcodeRequired = true;
    function convert_DT(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    $scope.myPromise = $http.get(HOSTNAME + "/roomDetailsFromBarcode_mob?empkey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + "&scannedBarcode=" + $scope.scannedBarcode)
        .success(function (response) {
            // $ionicLoading.hide();
            $scope.roomDetails = response;
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
    $scope.createWorkorder = function (WorkorderTypeKey, isBarcodeRequired) {
        var wot;
        console.log("WorkorderTypeKey " + WorkorderTypeKey + " isBarcodeRequired =" + isBarcodeRequired);
        if (WorkorderTypeKey) {
            wot = WorkorderTypeKey;
        } else {
            wot = null;
            var alertPopup = $ionicPopup.alert({
                title: 'Workorder Creation',
                template: 'Workorder Type is not provided!'
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
        var isBar = 0;
        if ($scope.scannedBarcode) {

            if (isBarcodeRequired == true) {
                isBar = 1;
            }
            else {
                isBar = 0;
            }

            $scope.myPromise = $http.get(HOSTNAME + "/mob_workorderCreateByEmployeeBarcodeWorkorderType?barcode=" + $scope.scannedBarcode + "&Date=" + $scope.today_DT + "&isBar=" + isBar + "&checkIn=" + p + "&emp=" + $scope.toServeremployeekey + "&wot=" + wot + "&OrganizationID=" + $scope.OrganizationID)
                .success(function (response) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Workorder',
                        template: 'Work order has been Created!'
                    });
                    $timeout(function () {
                        $ionicLoading.hide();
                        alertPopup.close();
                        // uploadingPopup.close();
                        console.log("role " + profile.role);
                        if (profile.role == 'Supervisor') {
                            $state.go('supervisorDashboard.detailedWorkorderView', { workorderKey: response[0].workorderkey });
                        }
                        else if (profile.role == 'Employee') {
                            $state.go('employeeDashboard.detailedWorkorderView', { workorderKey: response[0].workorderkey });
                        }

                    }, 1000);
                    console.log("Workorder*******" + response[0].workorderkey);
                });

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
    }
    $scope.toggleButton = function (isBarcodeRequired) {
        console.log("isBarcodeRequired  " + isBarcodeRequired);
        $scope.isBarcodeRequired = isBarcodeRequired;
    }
});