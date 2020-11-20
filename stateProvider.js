//  page Navigation
myApp.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {

  $stateProvider
  .state('index', {
    url: '/',  
    templateUrl: 'template/login.html',
    cache: false
})



.state('supervisorhome', {
    url: '/supervisorhome',   
            templateUrl: 'template/supervisorhome.html'
    
})
.state('emphome', {
    url: '/emphome',   
            templateUrl: 'template/employeeHome.html'
    
})

.state('emphome.viewWorkorder', {
  url:'/viewWorkorder', 
        templateUrl: 'template/Workorders/viewWorkorder.html',
        controller: 'WorkOrderViewCtrl'
   
})
.state('scanforworkorders', {
  url:'/scanforworkorders',
            templateUrl: 'template/scanforworkorders.html',
          controller: 'employeeHomeCtrl'
    
})

.state('logout', {
  url:'/login',
  templateUrl: 'login.html'
})

.state('home', {
    url:'/home',
    templateUrl: 'template/home.html'
  })
.state('workorder', {
  url:'/workorder',  
      templateUrl: 'template/Workorders/workorder.html'
    
})
.state('newWorkorder', {
  url:'/newWorkorder',
  templateUrl: 'template/Workorders/newWorkorder.html',
})

.state('customworklist', {
  url:'/customworklist',
  templateUrl: 'template/customworklist.html'
})
.state('managerviewworkorder', {
  url:'/managerviewworkorder',
  templateUrl: 'template/Workorders/managerviewworkorder.html',
  controller: 'WorkOrderViewCtrl'
})
.state('inventory', {
  url:'/inventory',
  templateUrl: 'template/Inventory/inventory.html',
})
.state('addInventory', {
  url:'/addInventory',
  templateUrl: 'template/Inventory/addInventory.html',
   controller: 'addInventoryCtrl'

})
.state('inspection', {
  url:'/inspection',
  templateUrl: 'template/Inspection/inspection.html'
})

.state('forms', {
  url:'/forms',
  templateUrl: 'template/Forms/forms.html'
})

.state('scheduling', {
  url:'/scheduling',
  templateUrl: 'template/Scheduling/scheduling.html'
})
.state('reporting', {
  url:'/reporting',
  templateUrl: 'template/Reporting/reporting.html'
})
.state('people', {
  url:'/people',
  templateUrl: 'template/People/people.html'
})
.state('employeeAddition', {
  url:'/employeeAddition',
  templateUrl: 'template/People/employeeAddition.html',
  controller: 'PeopleCtrl'
})
.state('viewpeopleSearchTable', {
  url:'/viewpeopleSearchTable',
  templateUrl: 'template/People/viewpeopleSearchTable.html',
  controller: 'PeopleCtrl'
})
.state('meeting_training', {
  url:'/meeting_training',
  templateUrl: 'template/People/meeting_training.html',
  controller: 'PeopleCtrl'
})
.state('supervisorhome.supervisorTraining', {
  url:'/supervisorTraining',
  templateUrl: 'template/People/supervisorTraining.html',
  controller: 'PeopleCtrl'
})
.state('emphome.viewTraining', {
  url:'/viewTraining',
  templateUrl: 'template/People/viewTraining.html',
  controller: 'PeopleCtrl'
})
.state('inspectionPage', {
  url:'/inspectionPage',
  templateUrl: 'template/Inspection/inspectionPage.html',
   controller: 'inspectionController'
})
.state('inspection_employee_list', {
  url:'/inspection_employee_list',
  templateUrl: 'template/Inspection/inspection_employee_list.html',
  controller: 'inspectionController'
})
.state('supervisorhome.viewInspectionorder', {
  url:'/viewInspectionorder',
  templateUrl: 'template/Inspection/viewInspectionorder.html',
  controller: 'inspectionViewCtrl'
})
.state('supervisorhome.viewInspectionorder.inspect', {
  url:'/inspectInspectionorder',
  templateUrl: 'template/Inspection/templateQuestionResults.html'
})
.state('newinspectionTemplate', {
  url:'/newinspectionTemplate',
  templateUrl: 'template/Inspection/newinspectionTemplate.html',
  controller: 'inspectionController'
})
.state('supervisorhome.emp_scannedRoom', {
  url:'/emp_scannedRoom',
  templateUrl: 'template/Workorders/emp_scannedRoom.html',
  controller: 'workorderControllerforRooms'
})
.state('manager_scannedRoom', {
  url:'/manager_scannedRoom',
  templateUrl: 'template/Workorders/manager_scannedRoom.html',
  //controller: 'ScanWorkOrderViewCtrlManager'
})
.state('supervisorhome.supervisorWorkorder', {
  url:'/supervisorWorkorder',
  templateUrl: 'template/Workorders/supervisorWorkorder.html'
})
.state('supervisorScannedRoom', {
  url:'/supervisorScannedRoom',
  templateUrl: 'template/Workorders/supervisorScannedRoom.html'
})
//$httpProvider.interceptors.push('authInterceptor');
 $ionicConfigProvider.backButton.text('Back').icon('ion-chevron-left').previousTitleText(false);
  $urlRouterProvider.otherwise("/");
 
});