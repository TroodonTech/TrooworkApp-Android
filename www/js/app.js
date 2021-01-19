// Ionic Starter App
function url_base64_decode(str) {
  var output = str.replace('-', '+').replace('_', '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw 'Illegal base64url string!';
  }
  return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
}
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var env = {};
if (window) {
  Object.assign(env, window._env);
}

var myApp = angular.module('starter', ['ionic', 'ui.router', 'ionic-ratings', 'ionicRating', 'ngCordova', 'ionic-datepicker', 'ui.bootstrap', 'ionic-timepicker', 'angularUtils.directives.dirPagination', 'ion-floating-menu', 'cgBusy', 'ui.filters'])
myApp.constant('__env', env);
myApp.constant('HOSTNAME', _env.apiSslUrl);
myApp.constant('AUTH_HOSTNAME', _env.apiUrl);
// myApp.constant('HOSTNAME','https://demotroowork.azurewebsites.net');
// myApp.constant('HOSTNAME','http://192.168.1.200:3000');
myApp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      // console.log(" Req header for Authorization "+$window.sessionStorage.token);
      if ($window.sessionStorage.token) {
        config.headers.Authorization = $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

myApp.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

myApp.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {


  $ionicConfigProvider.tabs.position('bottom');


  $stateProvider
    .state('login', {
      cache: false,
      url: '/',
      templateUrl: 'templates/login/login.html',
      controller: 'loginCtrl',
      reload: true
    })
    .state('managerDashboard', {
      url: '/managerDashboard',
      templateUrl: 'templates/login/managerDashboard.html',
      controller: 'loginCtrl',
      cache: false
    })
    .state('supervisorDashboard', {
      url: '/supervisorDashboard',
      templateUrl: 'templates/login/supervisorDashboard.html',
      controller: 'loginCtrl',
      cache: false
    })
    .state('employeeDashboard', {
      url: '/employeeDashboard',
      templateUrl: 'templates/login/employeeDashboard.html',
      controller: 'loginCtrl',
      cache: false
    })
    .state('employeeDashboard.dashboardViewEmployee', {
      url: '/dashboardViewEmployee',
      views: {
        'tab-empHome': {
          templateUrl: 'templates/employee/dashboardViewEmployee.html',
          controller: 'dashboardController'
        },
        'tab-employeeview': {
          templateUrl: 'templates/employee/dashboardViewEmployee.html',
          controller: 'dashboardController'
        }
      }
    })
    .state('employeeDashboard.employeeworks', {
      url: '/employeeworks',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/employeeWorks.html',
          controller: 'workorderViewController'
        }
      }
    })
    .state('employeeDashboard.scanforworkEmp', {
      url: '/employeescanWorks',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/scannedEmployeeWorks.html',
          controller: 'workorderDetailsCtrl',
          cache: false
        }
      }
    })
    .state('employeeDashboard.filteringByEmployeeList', {
      url: '/filteringByEmployeeList',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/filteringByEmployeeList.html',
          controller: 'workorderFilteringByEmployeeCtrl'
        }
      }
    })
    .state('employeeDashboard.filteringByDate', {
      url: '/filteringByDate',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/filteringByDate.html',
          controller: 'workorderFilteringByDateCtrl'
        }
      }
    })
    .state('employeeDashboard.filteringByFacility', {
      url: '/filteringByFacility',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/filteringByFacility.html',
          controller: 'WorkOrderFilteringByFacilityCtrl',
          cache: true
        }
      }
    })
    .state('employeeDashboard.filteringByStatus', {
      url: '/filteringByStatus',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/filteringByStatus.html',
          controller: 'WorkOrderFilteringByStatusCtrl'
        }
      }
    })
    .state('employeeDashboard.detailedWorkorderView', {
      url: '/workorderDetails/:workorderKey',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/workorderDetails.html',
          controller: 'workorderDetailsCtrl'
        }
      }
    })

    .state('employeeDashboard.takephotoUpload', {
      url: '/takephotoUpload',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/WorkorderTakephotoUpload.html',
          controller: 'workorderDetailsCtrl'
        }
      }
    })
    .state('supervisorDashboard.dashboardViewSupervisor', {
      url: '/dashboardViewSupervisor',
      views: {
        'tab-supervisorHome': {
          templateUrl: 'templates/supervisor/dashboardViewSupervisor.html',
          controller: 'dashboardController'
        },
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/dashboardViewSupervisor.html',
          controller: 'dashboardController'
        }
      }
    })
    .state('supervisorDashboard.takephotoUpload', {
      url: '/takephotoUpload_supervisor',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/WorkorderTakephotoUpload.html',
          controller: 'workorderDetailsCtrl'
        }
      }
    })
    .state('supervisorDashboard.supervisorworks', {
      url: '/supervisorworks',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/supervisorWorks.html',
          controller: 'workorderViewController'
        }
      }
    })

    .state('supervisorDashboard.filteringByDate', {
      url: '/filteringByDate',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/filteringByDate.html',
          controller: 'workorderFilteringByDateCtrl'
        }
      }
    })
    .state('supervisorDashboard.filteringByFacility', {
      url: '/filteringByFacility',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/filteringByFacility.html',
          controller: 'WorkOrderFilteringByFacilityCtrl'
        }
      }
    })
    .state('supervisorDashboard.filteringByStatus', {
      url: '/filteringByStatus',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/filteringByStatus.html',
          controller: 'WorkOrderFilteringByStatusCtrl'
        }
      }
    })
    .state('supervisorDashboard.detailedWorkorderView', {
      url: '/workorderDetails/:workorderKey',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/workorderDetails.html',
          controller: 'workorderDetailsCtrl',
          cache: true
        }
      }
    })
    .state('supervisorDashboard.findemployee', {
      url: '/findemployee',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/FindEmployee/findemployeeSupervisor.html',
          controller: 'findemployeeMapController'
        }
      }
    })
    .state('supervisorDashboard.inspection', {
      url: '/supervisorInspection',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/inspection/supervisorInspection.html',

          cache: true
        }
      }
    })
    .state('supervisorDashboard.createInspection', {
      url: '/createInspection',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/inspection/createInspection.html',
          controller: 'inspectionAddCtrl',
          cache: true
        }
      }
    })
    .state('supervisorDashboard.inspectionorderProvided', {
      url: '/inspectionprovided',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/inspection/inspectionProvided.html',
          controller: 'inspectionViewCtrl',
          cache: true
        }
      }
    })
    .state('supervisorDashboard.inspectionDetails', {
      url: '/inspectionDetails',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/inspection/inspectionDetails.html',
          controller: 'inspectionEditCtrl'
        }
      }
    })
    .state('supervisorDashboard.scanforwork', {
      url: '/supervisorscanWorks',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/scannedSupervisorWorks.html',
          controller: 'workorderDetailsCtrl',
          cache: false
        }
      }
    })
    .state('supervisorDashboard.filteringByEmployeeList', {
      url: '/filteringByEmployeeListSuper',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/filteringByEmployeeList.html',
          controller: 'workorderFilteringByEmployeeCtrl'
        }
      }
    })
    .state('managerDashboard.dashboardViewManager', {
      url: '/dashboardViewManager',
      views: {
        'tab-home': {
          templateUrl: 'templates/manager/dashboardViewManager.html',
          controller: 'dashboardController'
        },
        'tab-managerview': {
          templateUrl: 'templates/manager/dashboardViewManager.html',
          controller: 'dashboardController'
        }
      }
    })
    .state('managerDashboard.managerWorkorderDashboard', {
      url: '/managerWorkorderDashboard',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/managerWorkorderDashboard.html',
          controller: 'logoutCtrl'
        }
      }
    })
    .state('managerDashboard.createWorkorder', {
      url: '/createWorkorder',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/createWorkorder.html',
          controller: 'workorderController'
        }
      }
    })

    .state('managerDashboard.createQuickOrder', {
      url: '/createQuickWorkorder',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/createQuickWorkorder.html',
          controller: 'quickWorkorderController'
        }
      }
    })
    .state('managerDashboard.managerViewWorkorder', {
      url: '/managerViewWorkorder',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/viewworkorder.html',
          controller: 'workorderViewController'
        }
      }
    })
    .state('managerDashboard.filteringByDate', {
      url: '/filteringByDate',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/filteringByDate.html',
          controller: 'workorderFilteringByDateCtrl'
        }
      }
    })
    .state('managerDashboard.filteringByFacility', {
      url: '/filteringByFacility',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/filteringByFacility.html',
          controller: 'WorkOrderFilteringByFacilityCtrl'
        }
      }
    })
    .state('managerDashboard.filteringByStatus', {
      url: '/filteringByStatus',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/filteringByStatus.html',
          controller: 'WorkOrderFilteringByStatusCtrl'
        }
      }
    })
    .state('managerDashboard.detailedWorkorderView', {
      url: '/workorderDetails/:workorderKey',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/workorderDetails.html',
          controller: 'workorderDetailsCtrl'
        }
      }
    })
    .state('managerDashboard.scanforwork', {
      url: '/managerscanWorks',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/scannedManagerWorks.html',
          controller: 'workorderDetailsCtrl',
          cache: false
        }
      }
    })
    .state('managerDashboard.inspectionorder', {
      url: '/managerInspection',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/inspection/viewInspectionorder.html',
          controller: 'inspectionViewCtrl',
          cache: false
        }
      }
    })
    .state('managerDashboard.createInspection', {
      url: '/createInspectionorder',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/inspection/createInspection.html',
          controller: 'inspectionAddCtrl',
          cache: true
        }
      }
    })
    .state('managerDashboard.inspectionorderProvided', {
      url: '/inspectionorderprovided',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/inspection/ViewInspectionProvided.html',
          controller: 'inspectionViewCtrl',
          cache: true
        }
      }
    })
    .state('managerDashboard.afterInspectionManagerView', {
      url: '/InspectionManagerView/:inspectionorderkey',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/inspection/afterInspectionManagerView.html',
          controller: 'inspectionDetailsCtrl',
          cache: false
        }
      }
    })
    .state('managerDashboard.inspectionDetails', {
      url: '/ManagerinspectionDetails',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/inspection/inspectionDetails.html',
          controller: 'inspectionEditCtrl'
        }
      }
    })
    .state('managerDashboard.filteringByEmployeeList', {
      url: '/filteringByEmployeeListManager',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/filteringByEmployeeList.html',
          controller: 'workorderFilteringByEmployeeCtrl'
        }
      }
    })
    .state('managerDashboard.findemployee', {
      url: '/findemployee',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/FindEmployee/findemployee.html',
          controller: 'findemployeeMapController'
        }
      }
    })
    .state('managerDashboard.mapLoader', {
      url: '/mapLoader',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/FindEmployee/mapLoading.html',
          controller: 'findemployeeMapController'
        }
      }
    })

    .state('managerDashboard.snapshot', {
      url: '/snapshot/:workorderKey',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/Snapshot.html',
          controller: 'SnapshotCtrl'
        }
      }
    })
    .state('employeeDashboard.createWorkOrderbyScan', { //create workorder by barcode scan
      url: '/employeecreateWorkOrderbyScan',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/workorderCreateByScan.html',
          controller: 'workorderDetailsCtrl',
          cache: false
        }
      }
    })
    .state('supervisorDashboard.createWorkOrderbyScan', { //create workorder by barcode scan
      url: '/supervisorCreateWorkOrderbyScan',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/workorderCreateByScan.html',
          controller: 'workorderDetailsCtrl',
          cache: false
        }
      }
    })
    .state('employeeDashboard.workorderCancel', {//workorder cancel page
      url: '/EmpworkorderCancel/:workorderKey',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/workorderCancel.html',
          controller: 'workorderDetailsCtrl'
        }
      }
    })
    .state('supervisorDashboard.workorderCancel', { //workorder cancel page
      url: '/SupworkorderCancel/:workorderKey',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/workorderCancel.html',
          controller: 'workorderDetailsCtrl',
          cache: false
        }
      }
    })
    .state('managerDashboard.workorderCancel', { //workorder cancel page
      url: '/ManWorkorderCancel/:workorderKey',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/workorderCancel.html',
          controller: 'workorderDetailsCtrl'
        }
      }
    })
    .state('supervisorDashboard.createWorkOrderbyRoomScaning', { //create workorder by barcode scan-workorder type select page
      url: '/createWorkOrderbyRoomScaning/:roomKey',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/createWorkOrderbyRoomScaning.html',
          controller: 'createWorkOrderbyRoomScaning',
          cache: false
        }
      }
    })
    .state('employeeDashboard.createWorkOrderbyRoomScaning', { //create workorder by barcode scan-workorder type select page
      url: '/createWorkOrderbyRoomScaning/:roomKey',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/createWorkOrderbyRoomScaning.html',
          controller: 'createWorkOrderbyRoomScaning',
          cache: false
        }
      }
    })
    .state('managerDashboard.fireBaseTrack', { // employee live tracking
      url: '/fireBaseTrack12',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/FindEmployee/fireBaseTrack.html',
          controller: 'fireBaseTrack'
        }
      }
    })
    // pie chart states starts here....
    .state('managerDashboard.workorder_pie', {
      url: '/workorderviewpie',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/workorderPie.html',
          controller: 'workorderPieController'
        }
      }
    })

    .state('managerDashboard.applyPieChartFilter', {
      url: '/applyPieChartFilter',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/workorderPieFilters.html',
          controller: 'workorderPieFiltersController'
        }
      }
    })
    .state('managerDashboard.ScanForInspection', {
      url: '/scanforinspection',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/inspection/ScanForInspection.html',
          controller: 'inspectionDetailsCtrl',
          cache: true
        }
      }
    })
    .state('managerDashboard.scanRoomForCreateInsp', {// scanRoomForCreateInsp
      url: '/scanRoomForCreateInsp',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/inspection/CreateInspectionByBarcodeScan.html',
          controller: 'InspectionCreateByScanCtrl',
          cache: false
        }
      }
    })
    .state('managerDashboard.scanRoomForCreateInspDetailPage', {// scanRoomForCreateInsp DetailPage
      url: '/scanRoomForCreateInspDetailPage/:roomKey',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/inspection/createInspectionbyRoomScaning.html',
          controller: 'InspectionCreateByScanCtrl',
          cache: false
        }
      }
    })
    .state('supervisorDashboard.scanRoomForCreateInsp', {// scanRoomForCreateInsp
      url: '/scanRoomForCreateInsp',
      views: {

        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/inspection/CreateInspectionByBarcodeScan.html',
          controller: 'InspectionCreateByScanCtrl',
          cache: false
        }
      }
    })
    .state('supervisorDashboard.scanRoomForCreateInspDetailPage', {// scanRoomForCreateInsp DetailPage
      url: '/scanRoomForCreateInspDetailPage/:roomKey',
      views: {

        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/inspection/createInspectionbyRoomScaning.html',
          controller: 'InspectionCreateByScanCtrl',
          cache: false
        }
      }
    })
    .state('managerDashboard.aboutapp', {
      url: '/aboutapp',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/login/aboutapp.html',
          controller: 'aboutappctrl',
          cache: false
        }
      }
    })
    .state('supervisorDashboard.aboutapp', {
      url: '/aboutapp',
      views: {

        'tab-supervisorView': {
          templateUrl: 'templates/login/aboutapp.html',
          controller: 'aboutappctrl',
          cache: false
        }
      }
    })
    .state('employeeDashboard.aboutapp', {
      url: '/aboutapp',
      views: {

        'tab-employeeview': {
          templateUrl: 'templates/login/aboutapp.html',
          controller: 'aboutappctrl',
          cache: false
        }
      }
    })
    .state('managerDashboard.scanworkorder', {
      url: '/scanworkorder/:barcode',
      views: {
        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/scannedManagerWorkOrder.html',
          controller: 'workorderscanCtrl'
        }
      }
    })
    .state('supervisorDashboard.scanworkorder', {
      url: '/scanworkorder/:barcode',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/scannedSupervisorWorkOrder.html',
          controller: 'workorderscanCtrl'
        }
      }
    })
    .state('employeeDashboard.scanworkorder', {
      url: '/scanworkorder/:barcode',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/scannedEmployeeWorkOrder.html',
          controller: 'workorderscanCtrl'
        }
      }
    })
    .state('managerDashboard.filteringByEmployeeListView', {
      url: '/filteringByEmployeeListManagerView/:employeekey/:workstatuskey',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/filteringByEmployeeListView.html',
          controller: 'workorderFilteringByEmployeeViewCtrl'
        }
      }
    })
    .state('managerDashboard.filteringByFacilityView', {
      url: '/filteringByFacilityView/:facilitykey/:floorkey/:zonekey',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/filteringByFacilityView.html',
          controller: 'workorderFilteringByFacilityViewCtrl'
        }
      }
    })
    .state('managerDashboard.filteringByStatusView', {
      url: '/filteringByStatusView/:statuskey',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/manager/workorder/filteringByStatusView.html',
          controller: 'WorkOrderFilteringByStatusViewCtrl'
        }
      }
    })
    .state('supervisorDashboard.filteringByEmployeeListView', {
      url: '/filteringByEmployeeListSupervisorView/:employeekey/:workstatuskey',
      views: {

        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/filteringByEmployeeListView.html',
          controller: 'workorderFilteringByEmployeeViewCtrl'
        }
      }
    })
    .state('supervisorDashboard.filteringByFacilityView', {
      url: '/filteringByFacilitySupervisorView/:facilitykey/:floorkey/:zonekey',
      views: {

        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/filteringByFacilityView.html',
          controller: 'workorderFilteringByFacilityViewCtrl'
        }
      }
    })
    .state('supervisorDashboard.filteringByStatusView', {
      url: '/filteringByStatusSupervisorView/:statuskey',
      views: {

        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/workorder/filteringByStatusView.html',
          controller: 'WorkOrderFilteringByStatusViewCtrl'
        }
      }
    })
    .state('employeeDashboard.filteringByEmployeeListView', {
      url: '/filteringByEmployeeListEmployeeView/:employeekey/:workstatuskey',
      views: {

        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/filteringByEmployeeListView.html',
          controller: 'workorderFilteringByEmployeeViewCtrl'
        }
      }
    })
    .state('employeeDashboard.filteringByFacilityView', {
      url: '/filteringByFacilityEmployeeView/:facilitykey/:floorkey/:zonekey',
      views: {

        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/filteringByFacilityView.html',
          controller: 'workorderFilteringByFacilityViewCtrl'
        }
      }
    })
    .state('employeeDashboard.filteringByStatusView', {
      url: '/filteringByStatusEmployeeView/:statuskey',
      views: {

        'tab-employeeview': {
          templateUrl: 'templates/employee/workorder/filteringByStatusView.html',
          controller: 'WorkOrderFilteringByStatusViewCtrl'
        }
      }
    })
    // pie chart states ends here....

    // Scheduler starts

    .state('managerDashboard.scheduler', {
      url: '/scheduler',
      views: {

        'tab-managerview': {
          templateUrl: 'templates/login/scheduler.html',
          controller: 'schedulerCtrl',
          cache: false
        }
      }
    })
    .state('supervisorDashboard.scheduler', {
      url: '/supervisorscheduler',
      views: {

        'tab-supervisorView': {
          templateUrl: 'templates/login/scheduler.html',
          controller: 'schedulerCtrl',
          cache: false
        }
      }
    })
    .state('employeeDashboard.scheduler', {
      url: '/employeescheduler',
      views: {

        'tab-employeeview': {
          templateUrl: 'templates/login/scheduler.html',
          controller: 'schedulerCtrl',
          cache: false
        }
      }
    })
    // Scheduler ends
    // PTO starts

    .state('employeeDashboard.managePTO', {
      url: '/managePTO',
      views: {

        'tab-employeeview': {
          templateUrl: 'templates/employee/scheduling/ptoManage.html',
          controller: 'logoutCtrl'
        }
      }
    })


    .state('employeeDashboard.employeeCreatePTO', {
      url: '/employeeCreatePTO',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/scheduling/createPTO.html',
          controller: 'ptoCreateCtrl'
        }
      }
    })



    .state('employeeDashboard.employeeViewPTO', {
      url: '/employeeViewPTO',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/scheduling/viewPTO.html',
          controller: 'PTOViewCtrl'
        }
      }
    })


    .state('employeeDashboard.employeeEditPTO', {
      url: '/employeeEditPTO/:ptorequestDetails',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/scheduling/PTODetailsEdit.html',
          controller: 'PTOEditCtrl'
        }
      }
    })

    .state('supervisorDashboard.managePTOSupervisor', {
      url: '/managePTOSupervisor',
      views: {

        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/scheduling/supervisorPTOManage.html',
          controller: 'logoutCtrl'
        }
      }
    })

    .state('supervisorDashboard.supervisorCreatePTO', {
      url: '/supervisorCreatePTO',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/scheduling/supervisorCreatePTO.html',
          controller: 'ptoCreateCtrl'
        }
      }
    })


    .state('supervisorDashboard.supervisorViewPTO', {
      url: '/supervisorViewPTO',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/scheduling/supervisorViewPTO.html',
          controller: 'PTOViewCtrl'
        }
      }
    })


    .state('supervisorDashboard.supervisorEditPTO', {
      url: '/supervisorEditPTO/:ptorequestDetails',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/scheduling/supervisorPTODetailsEdit.html',
          controller: 'PTOEditCtrl'
        }
      }
    })

    // PTO ends
    //Trade Starts...

    .state('employeeDashboard.manageTrade', {
      url: '/manageTrade',
      views: {

        'tab-employeeview': {
          templateUrl: 'templates/employee/scheduling/manageTrade.html',
          controller: 'logoutCtrl'
        }
      }
    })


    .state('employeeDashboard.employeeCreateTrade', {
      url: '/employeeCreateTrade',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/scheduling/createTrade.html',
          controller: 'tradeCreateCtrl'
        }
      }
    })



    .state('employeeDashboard.employeeViewTrade', {
      url: '/employeeViewTrade',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/scheduling/viewTrade.html',
          controller: 'tradeViewCtrl'
        }
      }
    })


    .state('employeeDashboard.employeeEditTrade', {
      url: '/employeeEditTrade/:traderequestDetails',
      views: {
        'tab-employeeview': {
          templateUrl: 'templates/employee/scheduling/tradeDetailsEdit.html',
          controller: 'tradeEditCtrl'
        }
      }
    })


    .state('supervisorDashboard.supervisorManageTrade', {
      url: '/supervisorManageTrade',
      views: {

        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/scheduling/supervisorManageTrade.html',
          controller: 'logoutCtrl'
        }
      }
    })


    .state('supervisorDashboard.supervisorCreateTrade', {
      url: '/supervisorCreateTrade',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/scheduling/supervisorCreateTrade.html',
          controller: 'tradeCreateCtrl'
        }
      }
    })



    .state('supervisorDashboard.supervisorViewTrade', {
      url: '/supervisorViewTrade',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/scheduling/supervisorViewTrade.html',
          controller: 'tradeViewCtrl'
        }
      }
    })


    .state('supervisorDashboard.supervisorEditTrade', {
      url: '/supervisorEditTrade/:traderequestDetails',
      views: {
        'tab-supervisorView': {
          templateUrl: 'templates/supervisor/scheduling/supervisorTradeDetailsEdit.html',
          controller: 'tradeEditCtrl'
        }
      }
    })
    //Trade ends...

    .state('logout', {
      cache: false,
      url: '/login',
      templateUrl: 'templates/login/login.html',
      controller: 'logoutCtrl',
      reload: true
    })
    ;
  $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.backButton.text('Back').icon('ion-chevron-left').previousTitleText(false);
  $urlRouterProvider.otherwise('/');
  $httpProvider.interceptors.push('authInterceptor');
});