//controller for view all workorder ->manager
myApp.controller('workorderDetailsCtrl', function (HOSTNAME, $cordovaFile, $ionicActionSheet, $cordovaFileTransfer, $scope, $ionicModal, $ionicSlideBoxDelegate, $stateParams, $cordovaCamera, $filter, $window, $ionicScrollDelegate, $ionicPopup, $state, $timeout, $http, $rootScope, $ionicPlatform, $cordovaBarcodeScanner, $ionicLoading, $interval) {
  var token = window.localStorage.getItem('token');
  $window.localStorage['token'] = token;
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(url_base64_decode(encodedProfile));
  // console.log("INSIDE WORKORDERDETAILS...."+profile);
  $scope.toServeremployeekey = profile.employeekey;
  $scope.isSupervisor = profile.IsSupervisor;
  $scope.OrganizationID = profile.OrganizationID;
  // alert($scope.isSupervisor);
  $scope.isDoubleScanDisabled = true;
  // $scope.getBackgroundGeolocation($scope.toServeremployeekey);

  $scope.scrollMainToTop = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };
  $scope.scrollSmallToTop = function () {
    $ionicScrollDelegate.$getByHandle('small').scrollTop();
  };
  // console.log("PASSED SCROLL....");
  var workorderkey_viewDetails = $stateParams.workorderKey;
  console.log("workorderkey_viewDetails " + workorderkey_viewDetails);
  if (workorderkey_viewDetails) {
    // console.log(workorderkey_viewDetails);
    $scope.noWorksFound = false;
    $scope.myPromise = $http.get(HOSTNAME + "/workorderDetails?SearchKey=" + workorderkey_viewDetails + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        response.forEach(function (data) {
          if (data.WorkorderTypeKey == - 1) {
            data.RoomText = "Refer Notes";
            data.FloorName = "Refer Notes";
            data.ZoneName = "Refer Notes";
          }
        })
        $scope.viewEmpWorkorderDetails = response;
        // console.log(workorderkey_viewDetails);
      })
    // .error(function(error){
    //           var errorPopup = $ionicPopup.alert({
    //                  title: 'Something went Wrong',
    //                  template: 'Please relogin!'
    //                                            });
    //           $timeout(function() {
    //                         $ionicLoading.hide();
    //                               errorPopup.close();
    //                               // uploadingPopup.close();
    //                            }, 1000);
    //     });
  }
  else {
    $scope.noWorksFound = true;
  }
  console.log("GOT WORK LIST....");
  $scope.getWorkorderDetails = function () {
    // $ionicLoading.show();
    $scope.myPromise = $http.get(HOSTNAME + "/workorderDetails?SearchKey=" + workorderkey_viewDetails + "&OrganizationID=" + $scope.OrganizationID)
      .success(function (response) {
        // $ionicLoading.hide();
        response.forEach(function (data) {
          if (data.WorkorderTypeKey == - 1) {
            data.RoomText = "Refer Notes";
            data.FloorName = "Refer Notes";
            data.ZoneName = "Refer Notes";
          }
        })
        $scope.viewEmpWorkorderDetails = response;
        console.log("getWorkorderDetails scan workorderDetails status" + $scope.viewEmpWorkorderDetails[0].WorkorderStatus);
      })
    // .error(function(error){
    //           var errorPopup = $ionicPopup.alert({
    //                  title: 'Something went Wrong',
    //                  template: 'Please relogin!'
    //                                            });
    //           $timeout(function() {
    //                         $ionicLoading.hide();
    //                               errorPopup.close();
    //                               // uploadingPopup.close();
    //                            }, 1000);
    //     });
  };
  $scope.scanResults = '';

  $scope.sttButton = false;

  // console.log("CALLING SCROLL TO TOP....");
  $scope.scrollToTop = function () { //ng-click for back to top button
    $ionicScrollDelegate.scrollTop();
    $scope.sttButton = false;  //hide the button when reached top
  };

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


  $scope.DownloadImage = function (WorkorderKey) {

    $scope.workorderKey = WorkorderKey;
    if ($scope.workorderKey) {
      $scope.myPromise = $http.get(HOSTNAME + "/getWorkorderImageByKey?key=" + $scope.workorderKey + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
          // console.log("get image Lenghth  " + response);
          // console.log(response);
          // console.log(response.ImageName);
          $scope.imageResponse = response.ImageName;

          // $scope.imageSrc  = _arrayBufferToBase64($scope.imageResponse.Photo.data);   //image from data base
          // $scope.imageSrc  = 'http://192.168.1.138:3000/pho1/'+$scope.imageResponse.ImageName; // image from remote project folder

          // $scope.imageSrc  = 'ftp://waws-prod-bay-055.ftp.azurewebsites.windows.net/site/wwwroot/pho1/'+$scope.imageResponse.ImageName; // image from remote project folder
          // console.log("image after conert to base64 "+$scope.imageResponse.ImageName);
          // File for download
          var url = "ftp://waws-prod-bay-055.ftp.azurewebsites.windows.net/site/wwwroot/" + $scope.imageResponse;
          // console.log(url);
          // File name only
          var filename = url.split("/").pop();
          // console.log(filename);
          // Save location
          var targetPath = cordova.file.externalRootDirectory + filename;
          var targetPath = cordova.file.dataDirectory + filename;
          // console.log(targetPath);
          $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
            // console.log('Success');
          }, function (error) {
            // console.log('Error');
          }, function (progress) {
            // console.log('progress');
            // PROGRESS HANDLING GOES HERE
          });
        })
      //  .error(function(error){
      //      var errorPopup = $ionicPopup.alert({
      //             title: 'Something went Wrong',
      //             template: 'Please relogin!'
      //                                       });
      //      $timeout(function() {
      //      $ionicLoading.hide();
      //            errorPopup.close();
      //            // uploadingPopup.close();
      //         }, 1000);
      // });
    }
    else {
      var alertPopup = $ionicPopup.alert({
        title: 'Invalid Id',
        template: 'Please, relogin and try again!'
      });
      $timeout(function () {
        $ionicLoading.hide();
        alertPopup.close();
        // uploadingPopup.close();
      }, 1000);
    }

  };
  $scope.uploadFlag = false;
  $scope.takePhoto = function (workorderkey) {
    console.log("INSIDE ...image" + workorderkey);
    if (profile.role == 'Supervisor') {
      $state.go('supervisorDashboard.takephotoUpload');
    }
    else if (profile.role == 'Employee') {
      $state.go('employeeDashboard.takephotoUpload');
    }

    $rootScope.workorderkey = workorderkey;

  };
  $scope.loadImage = function () {
    var options;
    var sourceType = null;
    var showActionSheet = $ionicActionSheet.show({
      buttons: [

        { text: 'Use Camera' }
      ],

      // destructiveText: 'Delete',
      titleText: 'Select Image Source',
      cancelText: 'Cancel',

      cancel: function () {
        // add cancel code...

      },

      buttonClicked: function (index) {
        $scope.uploadFlag = true;
        //            if(index === 0) {
        //               // add edit 1 code
        //
        //               options = {
        //                        quality: 45,
        //                        destinationType: Camera.DestinationType.FILE_URI,
        //                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        //                        // allowEdit: true,
        //                        encodingType: Camera.EncodingType.JPEG,
        //                        // targetWidth: 100,
        //                        // targetHeight:100,
        //                        popoverOptions: CameraPopoverOptions,
        //                        saveToPhotoAlbum: true
        //                  }
        //               // console.log("gallery"+$scope.workorderkey+".."+index);
        //               // $scope.captureImage($rootScope.workorderkey);
        //
        //            }

        if (index === 0) {
          // add edit 2 code

          options = {
            quality: 45,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            // allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            // targetWidth: 100,
            // targetHeight:100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
          }
          // console.log("camera"+$scope.workorderkey+".."+index);
          // $scope.captureImage($rootScope.workorderkey);

        }
        $ionicPlatform.ready(function () {
          $cordovaCamera.getPicture(options).then(function (imagePath) {
            // console.log("inside getpicture "+ imagePath);
            var currentName = imagePath.replace(/^.*[\\\/]/, '');
            // console.log("imagePath "+ imagePath);
            //Create a new name for the photo
            var d = new Date(),
              n = d.getTime(),
              newFileName = n + ".jpg";
            // console.log("sourceType "+ sourceType+"options.sourceType "+options.sourceType);
            var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            // console.log("inside camera "+namePath+" image path "+imagePath);
            // Move the file to permanent storage
            $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName)
              .then(function (success) {
                $scope.image = newFileName;
                // console.log(" final image name "+$scope.image);
                return true;
              }, function (error) {
                // console.log('Error in else ', error.exception);
              });

          });
        });

        return true;

      },

      // destructiveButtonClicked: function() {
      //    // add delete code..
      // }
    });
  };



  $scope.pathForImage = function (image) {
    if (image === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + image;
    }
  };
  $scope.workorderCompletionTime = function (time, workorder_Key) {

    console.log("inside workorderCompletionTime method " + workorder_Key);
    $scope.workcompletion = {};
    $scope.workcompletion.Workorderkey = workorder_Key;
    $scope.workcompletion.Timetaken = time;
    $scope.workcompletion.EmployeeKey = $scope.toServeremployeekey;
    $scope.workcompletion.OrganizationID = $scope.OrganizationID;
    // console.log($scope.workcompletion);
    $http.post(HOSTNAME + "/completionTime", $scope.workcompletion);

  };
  $scope.uploadImage = function () {
    // console.log("uploadflag  "+$scope.uploadFlag);
    if ($scope.uploadFlag === false) {
      var alertPopup = $ionicPopup.alert({
        title: '<i class="icon ion-alert-circled"></i> Warning',
        template: 'Choose Image and upload!'
      });
      $timeout(function () {
        $ionicLoading.hide();
        alertPopup.close();
        // uploadingPopup.close();
      }, 1000);
    } else {
      var uploadingPopup;
      // Destination URL
      var url = HOSTNAME + "/uploadImageFromSmallDevices";

      // File for Upload
      var targetPath = $scope.pathForImage($scope.image);

      // File name only
      var filename = $scope.image;;
      // console.log("targetPath "+targetPath);
      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': filename }
      };

      $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
        // console.log("SUCCESS: " + JSON.stringify(result.response));
        var compare = JSON.stringify(result.response);
        // console.log(compare);
        $ionicLoading.hide();
        if (compare === '"File is uploaded"') {
          var uploadImagePopup = $ionicPopup.alert({
            title: 'Success',
            template: 'Successfully uploaded the image!'
          });
          $timeout(function () {
            $ionicLoading.hide();
            uploadImagePopup.close();
            // uploadingPopup.close();
          }, 1000);
          // console.log("workorderkey "+$rootScope.workorderkey);
          $scope.uploadPhoto = {};
          $scope.uploadPhoto.Filename = filename;
          $scope.uploadPhoto.Workorderkey = $rootScope.workorderkey;
          $scope.uploadPhoto.EmployeeKey = $scope.toServeremployeekey;
          $scope.uploadPhoto.OrganizationID = $scope.OrganizationID;
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
          $scope.uploadPhoto.complete_Time = p;
          //  pho1Snapshot_Ang6
          // console.log($scope.uploadPhoto);
          $scope.myPromise = $http.post(HOSTNAME + "/pho1Snapshot_Ang6", $scope.uploadPhoto)
            .then(function (resp) {
              // console.log("...IMAGE UPLOADED AS ...."+$scope.serverLocation+"....."+"..."+$rootScope.workorderkey+"..."+$scope.toServeremployeekey);
              if (resp) {
                // console.log("workorderkey_viewDetails "+workorderkey_viewDetails);
                $scope.myPromise = $http.get(HOSTNAME + "/workorderDetails?SearchKey=" + $rootScope.workorderkey + "&OrganizationID=" + $scope.OrganizationID)
                  .success(function (response) {

                    $scope.workorderDetail = response;
                    workorderkey_viewDetails = $rootScope.workorderkey;
                    // console.log($scope.workorderDetail[0].WorkorderStatus);
                    // if ($scope.workorderDetail[0].WorkorderStatus === 'Completed') {
                    //   var TimeTaken = 10;
                    //   // console.log("Work statusFlag... "+TimeTaken+"workorderkey before completion "+$rootScope.workorderkey);

                    //   $scope.workorderCompletionTime(TimeTaken, $rootScope.workorderkey);
                    //   // $scope.showPopup($rootScope.workorderkey,TimeTaken);
                    //   // $scope.getWorkorderDetails();
                    //   if (profile.role === 'Manager') {
                    //     $state.go('managerDashboard.managerViewWorkorder');
                    //   }
                    //   else if (profile.role == 'Employee' && profile.IsSupervisor == 1) {
                    //     $state.go('supervisorDashboard.supervisorworks');
                    //   }
                    //   else if (profile.role == 'Employee' && profile.IsSupervisor == 0) {
                    //     $state.go('employeeDashboard.employeeworks');
                    //   }
                    // }
                    // else {
                    // console.log("Work started... ");
                    // $scope.getWorkorderDetails();
                    if (profile.role === 'Manager') {
                      $state.go('managerDashboard.detailedWorkorderView', { workorderKey: $rootScope.workorderkey });
                    }
                    else if (profile.role == 'Supervisor') {
                      $state.go('supervisorDashboard.detailedWorkorderView', { workorderKey: $rootScope.workorderkey });
                    }
                    else if (profile.role == 'Employee') {
                      $state.go('employeeDashboard.detailedWorkorderView', { workorderKey: $rootScope.workorderkey });
                    }
                    // }
                    $scope.getWorkorderDetails();
                  });
                // if($scope.isSupervisor === 1){
                //   $state.go('supervisorDashboard.takephotoUpload');
                // }
                // else{
                //   $state.go('employeeDashboard.takephotoUpload');
                // }
              }
            }, function (err) {
              // error
              // console.log('error from pho1'+ err);
              uploadingPopup.close();
              var alertPopup1 = $ionicPopup.alert({
                title: '<i class="icon ion-alert-circled"></i> Warning',
                template: 'Image uploading was not processed properly! Please try again later!'
              });
              $timeout(function () {
                $ionicLoading.hide();
                alertPopup1.close();
                // uploadingPopup.close();
              }, 1000);
            });
        }
        else {
          $ionicLoading.hide();
          // uploadingPopup.close();
          var alertPopup2 = $ionicPopup.alert({
            title: '<i class="icon ion-alert-circled"></i> Warning',
            template: 'Image uploading was not processed properly! Please try again later!'
          });
          $timeout(function () {
            $ionicLoading.hide();
            alertPopup2.close();
            // uploadingPopup.close();
          }, 1000);
        }

      },
        function (err) {
          $ionicLoading.hide();
          var alertPopup3 = $ionicPopup.alert({
            title: '<i class="icon ion-alert-circled"></i> Warning',
            template: 'Image uploading was not processed properly! Please try again later!'
          });
          $timeout(function () {
            $ionicLoading.hide();
            alertPopup3.close();
            // uploadingPopup.close();
          }, 1000);
          // console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
          $ionicLoading.show({ template: 'Uploading...' });
          // console.log("Transfer in progress..."+progress);
          // constant progress updates
        });
      $ionicLoading.hide();
      // uploadingPopup.close();
    }
  };



  $ionicLoading.hide();
  //     $scope.captureImage = function(workorderkey) {
  //     console.log("INSIDE ...image"+workorderkey);

  //     var workorder_Key = workorderkey;

  //         // confirmPopup.then(function(res) {
  //             $ionicPlatform.ready(function() {
  //                   // var options = {
  //                   //       quality: 45,
  //                   //       destinationType: Camera.DestinationType.FILE_URI,
  //                   //       sourceType: sourceType,
  //                   //       allowEdit: true,
  //                   //       encodingType: Camera.EncodingType.JPEG,
  //                   //       // targetWidth: 100,
  //                   //       // targetHeight:100,
  //                   //       popoverOptions: CameraPopoverOptions,
  //                   //       saveToPhotoAlbum: false

  //                   //   }
  //                              $cordovaCamera.getPicture(options).then(function(imageData) {
  //                               $scope.photo = imageData;
  //                               var image = document.getElementById('myImage');
  //                               //image.src = "data:image/jpeg;base64," + imageData;
  //                               var string = encodeURIComponent(imageData);
  //                               $scope.imgURI = "data:image/jpg;base64," + string;
  //                               // alert('imageData: ' +imageData);
  //                               console.log("file url"+$scope.photo);
  //                               // console.log($scope.serverLocation+"...IMAGE UPLOADED AS "+"..."+workorder_Key+"..."+$scope.toServeremployeekey);

  //                               $http.post($scope.serverLocation+"/pho1?pho="+$scope.imgURI+"&wkey=" + workorder_Key+"&employeekey="+$scope.toServeremployeekey +"")
  //                                        .then(function(resp)
  //                                       {
  //                                         // console.log("...IMAGE UPLOADED AS "+$scope.imgURI+"...."+$scope.serverLocation+"....."+"..."+workorder_Key+"..."+$scope.toServeremployeekey);
  //                                             if(resp){
  //                                                   $http.get($scope.serverLocation+"/workorderDetails?SearchKey=" + workorderkey_viewDetails)
  //                                                   .success(function (response){

  //                                                       $scope.workorderDetail = response;
  //                                                       console.log($scope.workorderDetail[0].WorkorderStatus);
  //                                                       if($scope.workorderDetail[0].WorkorderStatus === 'Completed'){
  //                                                     // console.log("Work statusFlag... "+statusFlag);
  //                                                                var TimeTaken = 10;
  //                                                               $scope.showPopup(workorder_Key,TimeTaken);
  //                                                               $scope.getWorkorderDetails();
  //                                                       }
  //                                                       else{
  //                                                              // console.log("Work started... ");
  //                                                              $scope.getWorkorderDetails();
  //                                                       }
  //                                                       $scope.getWorkorderDetails();
  //                                                   });
  //                                             }

  //                                             var trustAllHosts = true;
  //                                             var ftOptions = new FileUploadOptions();
  //                                             ftOptions.fileKey = 'file';
  //                                             ftOptions.fileName = $scope.photo.substr($scope.photo.lastIndexOf('/') + 1);
  //                                             ftOptions.mimeType = 'image/jpeg';
  //                                             ftOptions.chunkedMode = false;
  //                                             ftOptions.httpMethod = 'POST';
  //                                             $cordovaFileTransfer.upload($scope.serverLocation+"/uploadImageFromSmallDevices", $scope.photo, ftOptions)
  //                                                   .then(function(result) {
  //                                                       console.log("SUCCESS: " + JSON.stringify(result.response));
  //                                                   }, function(err) {
  //                                                       console.log("ERROR: " + JSON.stringify(err));
  //                                                   }, function (progress) {
  //                                                     console.log("errorrrrrr in  file transfer...");
  //                                                       // constant progress updates
  //                                                   });
  //                                           //   var options = new FileUploadOptions();
  //                                           //      options.fileKey = "file";
  //                                           //      options.fileName = $scope.photo.substr(imageURI.lastIndexOf('/') + 1);
  //                                           //      options.mimeType = "image/jpeg";
  //                                           //  console.log("file name"+options.fileName);
  //                                           //  var params = new Object();
  //                                           //      params.value1 = "test";
  //                                           //      params.value2 = "param";
  //                                           //      options.params = params;
  //                                           //      options.chunkedMode = false;

  //                                           // var ft = new FileTransfer();
  //                                           //  ft.upload($scope.photo, "ftp://waws-prod-bay-055.ftp.azurewebsites.windows.net/site/wwwroot/pho1/"+options.fileName, function(result){
  //                                           //  console.log("success"+JSON.stringify(result));
  //                                           //  }, function(error){
  //                                           //  console.log("error"+JSON.stringify(error));
  //                                           //  }, options);

  //                                       },function(err) {
  //                                           // error
  //                                           console.log('error from pho1'+ err);
  //                                           var alertPopup = $ionicPopup.alert({
  //                                                title: '<i class="icon ion-alert-circled"></i> Warning',
  //                                                template: 'Your action was not processed properly! Please try again later!'
  //                                           });
  //                                       });

  //                               },function(err) {
  //                                 // error
  //                                 console.log('error from cordova images'+ err);
  //                                 });
  //                         });
  //   // });

  // };
  //bar code scanner code will be placed here
  $scope.scanBarcode = function (workorderkey) {
    // console.log("INSIDE ...Barcode");

    if ($scope.isDoubleScanDisabled) {
      console.log("$scope.isDoubleScanDisabled......" + $scope.isDoubleScanDisabled);
      var workorder_Key = workorderkey;
      $ionicPlatform.ready(function () {
        //alert('Platform ready');
        window.plugins.flashlight.switchOn();
        $cordovaBarcodeScanner
          .scan()
          .then(function (result) {
            // alert();
            // Success! Barcode data is here
            $scope.scanResults = "We got a barcoden" +
              "Result: " + result.text + "n" +
              "Format: " + result.format + "n" +
              "Cancelled: " + result.cancelled;
            $scope.scannedBarcode = result.text;
            window.plugins.flashlight.switchOff();
            // console.log("CHECKING BARCODE VALUE "+$scope.scannedBarcode);
            console.log("rootScope.serverLocation" + $rootScope.serverLocation);
            if (result.text.length > 0) {
              $scope.myPromise = $http.get(HOSTNAME + "/barcodeRoom_check?barcode=" + result.text + "&wkey=" + workorder_Key + "&OrganizationID=" + $scope.OrganizationID)
                .success(function (response) {
                  // console.log("checking roomBarcode... "+response);
                  var result = response;
                  if (result == 1) {

                    var t = new Date();
                    var y = t.getFullYear();
                    var m = t.getMonth();
                    var d = t.getDate();
                    var h = t.getHours();
                    var mi = t.getMinutes();
                    var s = t.getSeconds();

                    $scope.today_DT = convert_DT(new Date());
                    var complete_Time = "";
                    complete_Time = $scope.today_DT + " " + h + ":" + mi + ":" + s;
                    // console.log("empkey"+$scope.empKey);
                    var type = 'automatic';
                    // console.log(type);
                    $scope.myPromise = $http.get(HOSTNAME + "/barcodeRoomWithSnapshot_Ang?wkey=" + workorder_Key + "&barcode=" + $scope.scannedBarcode + "&updatetype=" + type + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + '&complete_Time=' + complete_Time)
                      .success(function (resp) {
                        // console.log("response..."+resp.WorkorderStatus);
                        var statusFlag = resp.WorkorderStatus;
                        // console.log("Staus flag = "+ statusFlag);
                        if (statusFlag == 'Completed') {
                          console.log("staatus flag is  completed... " + workorder_Key);
                          // $scope.showPopup(workorder_Key,resp.TimeTaken);
                          $scope.workcompletion = {};
                          $scope.workcompletion.Workorderkey = workorder_Key;
                          $scope.workcompletion.Timetaken = resp.TimeTaken;
                          $scope.workcompletion.EmployeeKey = $scope.toServeremployeekey;

                          // var inpro_count=0;
                          $scope.getWorkorderDetails();

                          var inpro_inter = $interval(function () {
                            // inpro_count=inpro_count+1

                            $scope.myPromise = $http.get(HOSTNAME + "/workorderDetails?SearchKey=" + workorderkey_viewDetails + "&OrganizationID=" + $scope.OrganizationID)
                              .success(function (response) {
                                // $ionicLoading.hide();

                                $scope.viewEmpWorkorderDetails = response;
                                console.log("inpro_inter scan workorderDetails status " + $scope.viewEmpWorkorderDetails[0].WorkorderStatus);
                              })




                            if ($scope.viewEmpWorkorderDetails[0].WorkorderStatus == 'Completed') {
                              $interval.cancel(inpro_inter);
                            };
                          }, 2500);


                        }
                        else {

                          // var she_count=0;
                          $scope.getWorkorderDetails();

                          var she_inter = $interval(function () {
                            // she_count=she_count+1;

                            $scope.myPromise = $http.get(HOSTNAME + "/workorderDetails?SearchKey=" + workorderkey_viewDetails + "&OrganizationID=" + $scope.OrganizationID)
                              .success(function (response) {
                                // $ionicLoading.hide();

                                $scope.viewEmpWorkorderDetails = response;
                                console.log("she_inter scan workorderDetails status " + $scope.viewEmpWorkorderDetails[0].WorkorderStatus);
                              })




                            if ($scope.viewEmpWorkorderDetails[0].WorkorderStatus != 'Scheduled') {
                              $interval.cancel(she_inter);
                            };

                          }, 2500);

                        }
                      })
                    //                 .error(function(error){
                    //                   var errorPopup = $ionicPopup.alert({
                    //                          title: 'Something went Wrong',
                    //                          template: 'Please relogin!'
                    //                    });
                    //                   $timeout(function() {
                    // $ionicLoading.hide();
                    //       errorPopup.close();
                    //       // uploadingPopup.close();
                    //    }, 1000);
                    //    });
                    // console.log("BARCODE 1 CHECK RESPONSE  ");
                    $scope.getWorkorderDetails();
                  }
                  else {
                    // console.log('failed check');
                    var alertPopup = $ionicPopup.alert({
                      title: 'Invalid Room',
                      template: 'Scan the correct barcode!'
                    });
                    $timeout(function () {
                      $ionicLoading.hide();
                      alertPopup.close();
                      // uploadingPopup.close();
                    }, 1000);
                    $scope.getWorkorderDetails();
                  }
                })
              // .error(function(error){
              //     var errorPopup = $ionicPopup.alert({
              //            title: 'Something went Wrong',
              //            template: 'Please relogin!'
              //                      });
              //     $timeout(function() {
              //   $ionicLoading.hide();
              //         errorPopup.close();
              //         // uploadingPopup.close();
              //      }, 1000);
              //  });
            }
            // alert('We got a barcoden - Result: '+result.text+ ' ...Format'+ result.format +"..key  "+workorder_Key);
          }, function (error) {
            // An error occurred
            $scope.scanResults = 'Error: ' + error;
          });
      });
    }
    $scope.isDoubleScanDisabled = false;
  };

  $scope.showBarcodePopupWorks = function (workorderkey) {
    // An elaborate, custom popup
    var workorder_Key = workorderkey;
    var type = 'manually';
    $scope.data = {}
    var myPopup = $ionicPopup.show({
      template:
        '<div class="list"> ' +
        '  <label class = "control-label item item-input"> ' +
        '<input type="text" ng-model="data.barcodeValue">' +
        '</label>' +
        '</div>',
      title: 'WORKORDER',
      subTitle: 'Enter barcode manually : ',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.data.barcodeValue) {
              //don't allow the user to close unless he enters wifi password
              // console.log("inside if..."+$scope.data.barcodeValue+"....");
              e.preventDefault();
            } else {
              result = $scope.data.barcodeValue;
              // console.log("result...."+result+"$scope.serverLocation"+$scope.serverLocation);
              $scope.myPromise = $http.get(HOSTNAME + "/barcodeRoom_check?barcode=" + $scope.data.barcodeValue + "&wkey=" + workorder_Key + "&OrganizationID=" + $scope.OrganizationID)
                .success(function (response) {
                  // console.log("checking roomBarcode... "+response);
                  var result = response;
                  if (result == 1) {
                    // console.log("empkey"+$scope.empKey);
                    $scope.myPromise = $http.get(HOSTNAME + "/barcodeRoom?wkey=" + workorder_Key + "&barcode=" + $scope.data.barcodeValue + "&updatetype=" + type + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
                      .success(function (resp) {
                        // console.log("response..."+resp.WorkorderStatus);
                        var statusFlag = resp.WorkorderStatus;
                        // console.log("Staus flag = "+ statusFlag);
                        if (statusFlag == 'Completed') {
                          // console.log("staatus flag is  completed... "+workorder_Key);
                          // $scope.showPopup(workorder_Key,resp.TimeTaken);

                          $scope.getWorkorderDetails();
                        }
                        else {
                          // console.log("Work started... ");
                          $scope.getWorkorderDetails();
                        }
                      })
                    //                             .error(function(error){
                    //                          var errorPopup = $ionicPopup.alert({
                    //                            title: 'Something went Wrong',
                    //                           template: 'Please relogin!'
                    //                                  });
                    // $timeout(function() {
                    //               $ionicLoading.hide();
                    //                     errorPopup.close();
                    //                     // uploadingPopup.close();
                    //                  }, 1000);
                    //       });
                    // console.log("BARCODE 1 CHECK RESPONSE  ");
                    $scope.getWorkorderDetails();
                  }
                  else {
                    // console.log('failed check');
                    var alertPopup = $ionicPopup.alert({
                      title: 'Invalid Room',
                      template: 'Please, try again!'
                    });
                    $scope.getWorkorderDetails();
                  }
                })
              //                   .error(function(error){
              //       var errorPopup = $ionicPopup.alert({
              //              title: 'Something went Wrong',
              //              template: 'Please relogin!'
              //                                        });
              //       $timeout(function() {
              //                     $ionicLoading.hide();
              //                           errorPopup.close();
              //                           // uploadingPopup.close();
              //                        }, 1000);
              // });
              $scope.getWorkorderDetails();
              return result;
            }
          }
        }
      ]
    });
    myPopup.then(function (res) {
      // console.log('Tapped!', res);
    });
  };


  $scope.workCompleted = function (workorderkey) {
    // alert(workorderkey);
    var t = new Date();
    var y = t.getFullYear();
    var m = t.getMonth();
    var d = t.getDate();
    var h = t.getHours();
    var mi = t.getMinutes();
    var s = t.getSeconds();

    $scope.today_DT = convert_DT(new Date());
    var complete_Time = "";
    complete_Time = $scope.today_DT + " " + h + ":" + mi + ":" + s;

    var workorder_Key = workorderkey;
    $scope.myPromise = $http.get(HOSTNAME + "/workCompleted_Ang6?wkey=" + workorder_Key + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID + '&complete_Time=' + complete_Time)
      .success(function (response) {
        var timeTaken = response.TimeTaken;
        // console.log("before"+timeTaken);
        if (timeTaken == null) {
          timeTaken = 10;
        }
        // console.log("after"+timeTaken);
        $scope.WorkorderStatus = response.workStatus;
        // var completionTime=$scope.showPopup(workorder_Key,timeTaken);
      })
    // .error(function(error){
    //               var errorPopup = $ionicPopup.alert({
    //                      title: 'Something went Wrong',
    //                      template: 'Please relogin!'
    //                                                });
    //               $timeout(function() {
    //                             $ionicLoading.hide();
    //                                   errorPopup.close();
    //                                   // uploadingPopup.close();
    //                                }, 1000);
    //         });
    $scope.getWorkorderDetails();
    if ($scope.WorkorderStatus == 'Completed') {
      console.log("staatus flag is  completed... " + workorder_Key);
      // $scope.showPopup(workorder_Key,resp.TimeTaken);
      $scope.workcompletion = {};
      $scope.workcompletion.Workorderkey = workorder_Key;
      $scope.workcompletion.Timetaken = resp.TimeTaken;
      $scope.workcompletion.EmployeeKey = $scope.toServeremployeekey;

      // var inpro_count=0;
      $scope.getWorkorderDetails();

      var inpro_inter = $interval(function () {
        // inpro_count=inpro_count+1

        $scope.myPromise = $http.get(HOSTNAME + "/workorderDetails?SearchKey=" + workorder_Key + "&OrganizationID=" + $scope.OrganizationID)
          .success(function (response) {
            // $ionicLoading.hide();

            $scope.viewEmpWorkorderDetails = response;
            console.log("inpro_inter scan workorderDetails status " + $scope.viewEmpWorkorderDetails[0].WorkorderStatus);
          })




        if ($scope.viewEmpWorkorderDetails[0].WorkorderStatus == 'Completed') {
          $interval.cancel(inpro_inter);
        };
      }, 2500);


    }
    else {

      // var she_count=0;
      $scope.getWorkorderDetails();

      var she_inter = $interval(function () {
        // she_count=she_count+1;

        $scope.myPromise = $http.get(HOSTNAME + "/workorderDetails?SearchKey=" + workorder_Key + "&OrganizationID=" + $scope.OrganizationID)
          .success(function (response) {
            // $ionicLoading.hide();

            $scope.viewEmpWorkorderDetails = response;
            console.log("she_inter scan workorderDetails status " + $scope.viewEmpWorkorderDetails[0].WorkorderStatus);
          })




        if ($scope.viewEmpWorkorderDetails[0].WorkorderStatus != 'Scheduled') {
          $interval.cancel(she_inter);
        };

      }, 2500);

    }
  };

  $scope.showPopup = function (workorder_Key, timeTaken) {
    // An elaborate, custom popup
    $scope.data = {}
    $scope.data.timeTaken = timeTaken;
    var myPopup = $ionicPopup.show({
      template: '<div class="list"> ' +
        '<label class = "control-label item item-input"> ' +
        '<input type="number" ng-model="data.timeTaken">' +
        '</label>' +
        '</div>',
      title: 'Work Completed',
      subTitle: 'Time taken to complete the work in minutes',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.data.timeTaken) {
              //don't allow the user to close unless he enters wifi password
              // console.log("inside if..."+$scope.data.timeTaken+"....");
              e.preventDefault();
            } else {
              // console.log("inside else..."+$scope.data.timeTaken+"....workorder_Key"+workorder_Key);
              var minutes = $scope.data.timeTaken;
              result = parseInt(minutes);
              // console.log("result...."+result+"...."+workorder_Key);
              $scope.workcompletion = {};
              $scope.workcompletion.Workorderkey = workorder_Key;
              $scope.workcompletion.Timetaken = result;
              $scope.workcompletion.EmployeeKey = $scope.toServeremployeekey;
              $scope.workcompletion.OrganizationID = $scope.OrganizationID;
              // console.log($scope.workcompletion);
              $http.post(HOSTNAME + "/completionTime", $scope.workcompletion);
              $scope.getWorkorderDetails();
              return result;
            }
          }
        }
      ]
    });

    myPopup.then(function (res) {
      // console.log('Tapped!', res);
    });
  };

  //..........FOR GETTINGB WORKORDER DETAILS....ENDS........
  //..........For Scanned workorder.....start....
  $scope.getEmployeeWorkorderByBarcode = function () {

    if ($scope.isDoubleScanDisabled) {
      console.log("$scope.isDoubleScanDisabled......" + $scope.isDoubleScanDisabled);
      $ionicPlatform.ready(function () {
        //alert('Platform ready');
        //alert("BARCODE SCANNING");
        window.plugins.flashlight.switchOn();
        $cordovaBarcodeScanner
          .scan()
          .then(function (result) {

            $scope.inbarcode = result.text;
            window.plugins.flashlight.switchOff();
            // console.log("CHECKING BARCODE VALUE "+$scope.inbarcode);
            if ($scope.inbarcode.length > 0) {
              //              $state.go('managerDashboard.scanworkorder', { barcode: $scope.inbarcode });
              if (profile.role == 'Supervisor') {
                $state.go('supervisorDashboard.scanworkorder', { barcode: $scope.inbarcode });
              }
              else if (profile.role == 'Employee') {
                $state.go('employeeDashboard.scanworkorder', { barcode: $scope.inbarcode });
              }
              else if (profile.role == 'Manager') {
                $state.go('managerDashboard.scanworkorder', { barcode: $scope.inbarcode });
              }
              //              var ondate = convert_DT(new Date());
              //              console.log("ondate......" + ondate);
              //              $scope.myPromise = $http.get(HOSTNAME + "/mob_scanforWorkorder_empAng6?barcode=" + $scope.inbarcode + "&empkey=" + $scope.toServeremployeekey + "&ondate=" + ondate + "&OrganizationID=" + $scope.OrganizationID)
              //                .success(function (response) {
              //                  console.log("response.length" + response.length);
              //                  if (response.length > 0) {
              //                    $scope.viewworkorder = response;
              //                    // console.log($scope.viewworkorder);
              //
              //                  }
              //                  else {
              //                    $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
              //                    var alertPopup = $ionicPopup.alert({
              //                      title: 'No work assigned to this room ' + $scope.data.barcodeValue,
              //                      template: 'Please, try again!'
              //                    });
              //                    $timeout(function () {
              //                      $ionicLoading.hide();
              //                      alertPopup.close();
              //                      // uploadingPopup.close();
              //                    }, 1000);
              //                  }
              //                  //alert('We got a barcoden - Result: '+$scope.inbarcode);
              //                })
              //              //    .error(function(error){
              //              //      var errorPopup = $ionicPopup.alert({
              //              //             title: 'Something went Wrong',
              //              //             template: 'Please relogin!'
              //              //                                       });
              //              //      $timeout(function() {
              //              //                    $ionicLoading.hide();
              //              //                          errorPopup.close();
              //              //                          // uploadingPopup.close();
              //              //                       }, 1000);
              //              // });
            }

          }, function (error) {
            // An error occurred
            $scope.scanResults = 'Error: ' + error;
            $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
            var errorPopup = $ionicPopup.alert({
              title: 'Invalid Barcode ' + $scope.data.barcodeValue,
              template: 'Please, try again!'
            });
            $timeout(function () {
              $ionicLoading.hide();
              errorPopup.close();
              // uploadingPopup.close();
            }, 1000);
          });
      });
    }
    $scope.isDoubleScanDisabled = false;
  };
  $scope.showBarcodePopup = function (workorderkey) {
    // An elaborate, custom popup
    console.log("inside showBarcodePopup function");
    var workorder_Key = workorderkey;
    var type = 'manually';
    $scope.data = {}
    console.log("istarting template");
    var myPopup = $ionicPopup.show({
      template:
        '<div class="list"> ' +
        '  <label class = "control-label item item-input"> ' +
        '<input type="text" ng-model="data.barcodeValue">' +
        '</label>' +
        '</div>',
      title: 'WORKORDER',
      subTitle: 'Enter barcode manually : ',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>OK</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.data.barcodeValue) {
              //don't allow the user to close unless he enters wifi password
              // console.log("inside if..."+$scope.data.barcodeValue+"....");
              e.preventDefault();
            } else {
              result = $scope.data.barcodeValue;

              //              $state.go('managerDashboard.scanworkorder', { barcode: $scope.data.barcodeValue });
              if (profile.role == 'Supervisor') {
                $state.go('supervisorDashboard.scanworkorder', { barcode: $scope.data.barcodeValue });
              }
              else if (profile.role == 'Employee') {
                $state.go('employeeDashboard.scanworkorder', { barcode: $scope.data.barcodeValue });
              }
              else if (profile.role == 'Manager') {
                $state.go('managerDashboard.scanworkorder', { barcode: $scope.data.barcodeValue });
              }

              //              var ondate = convert_DT(new Date());
              //              // console.log("inside else..."+$scope.data.barcodeValue+"....");
              //              // console.log("result...."+result);
              //              console.log("ondate...." + result);
              //              $scope.myPromise = $http.get(HOSTNAME + "/mob_scanforWorkorder_empAng6?barcode=" + $scope.data.barcodeValue + "&empkey=" + $scope.toServeremployeekey + "&ondate=" + ondate + "&OrganizationID=" + $scope.OrganizationID)
              //                .success(function (response) {
              //                  // console.log("response.length"+response.length);
              //                  if (response.length > 0) {
              //                    $scope.viewworkorder = response;
              //                    // console.log($scope.viewworkorder);
              //
              //                  }
              //                  else {
              //                    $scope.viewworkorder = [{ "WorkorderTypeName": "No works found!" }];
              //                    var alertPopup = $ionicPopup.alert({
              //                      title: 'No work assigned to this room ' + $scope.data.barcodeValue,
              //                      template: 'Please, try again!'
              //                    });
              //                    $timeout(function () {
              //                      $ionicLoading.hide();
              //                      alertPopup.close();
              //                      // uploadingPopup.close();
              //                    }, 1000);
              //                  }
              //                  //alert('We got a barcoden - Result: '+$scope.inbarcode);
              //                })
              //              //     .error(function (error, status, headers, config) {
              //              //       // console.log("status "+status);
              //              //       var alertPopup = $ionicPopup.alert({
              //              //              title: 'Something went Wrong',
              //              //              template: 'Please relogin!'
              //              //                                        });
              //              //       $timeout(function() {
              //              //                     $ionicLoading.hide();
              //              //                           alertPopup.close();
              //              //                           // uploadingPopup.close();
              //              //                        }, 1000);
              //              // });
              //
              //
              //              // $scope.loadFunction();
              //              return result;
            }
          }
        }
      ]
    });
    myPopup.then(function (res) {
      // console.log('Tapped!', res);
    });
  };
  //..........For scanned workorder.....ends.....

  //displaying image in ionic modal
  // $ionicModal.fromTemplateUrl('image-modal.html', {
  //      scope: $scope,
  //      animation: 'slide-in-up'
  //    }).then(function(modal) {
  //      $scope.modal = modal;
  //    });

  //    $scope.openModal = function() {
  //      $scope.modal.show();
  //    };

  //    $scope.closeModal = function() {
  //      $scope.modal.hide();
  //    };

  //    //Cleanup the modal when we're done with it!
  //    $scope.$on('$destroy', function() {
  //      // $scope.modal.remove();
  //    });
  //    // Execute action on hide modal
  //    $scope.$on('modal.hide', function() {
  //      // Execute action
  //    });
  //    // Execute action on remove modal
  //    $scope.$on('modal.removed', function() {
  //      // Execute action
  //    });
  //    $scope.$on('modal.shown', function() {
  //      // console.log('Modal is shown!');
  //    });
  $scope.updateSlideStatus = function () {
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
  // $scope.imageSrc = 'http://ionicframework.com/img/ionic-logo-blog.png';

  $scope.showImage = function (workorderKey) {
    // alert("called");
    $scope.workorderKey = workorderKey;
    if ($scope.workorderKey) {
      $scope.myPromise = $http.get(HOSTNAME + "/getWorkorderImageByKey?key=" + $scope.workorderKey + "&employeekey=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
        .success(function (response) {
          // console.log("get image Lenghth  " + response);
          // console.log(response);
          $scope.imageResponse = response;
          // $scope.imageSrc  = _arrayBufferToBase64($scope.imageResponse.Photo.data);   //image from data base
          // $scope.imageSrc  = 'http://192.168.1.138:3000/pho1/'+$scope.imageResponse.ImageName; // image from remote project folder

          $scope.imageSrc = 'ftp://waws-prod-bay-055.ftp.azurewebsites.windows.net/site/wwwroot/pho1/' + $scope.imageResponse.ImageName; // image from remote project folder
          // console.log("image after conert to base64 "+$scope.imageResponse.ImageName);

        })
      //    .error(function(error){
      //       var errorPopup = $ionicPopup.alert({
      //              title: 'Something went Wrong',
      //              template: 'Please relogin!'
      //                                        });
      //       $timeout(function() {
      //                     $ionicLoading.hide();
      //                           errorPopup.close();
      //                           // uploadingPopup.close();
      //                        }, 1000);
      // });
    }
    else {
      var alertPopup = $ionicPopup.alert({
        title: 'Invalid Id',
        template: 'Please, relogin and try again!'
      });
      $timeout(function () {
        $ionicLoading.hide();
        alertPopup.close();
        // uploadingPopup.close();
      }, 1000);
    }

    // $scope.imageSrc  = 'http://ionicframework.com/img/homepage/phones-weather-demo@2x.png';

    $scope.openModal();
  };
  //convert base64 byte[] to base64 string
  function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  $scope.delayCurrentWorkOrder = function (WorkorderKey) {

    console.log("delayCurrentWorkOrder in delay " + WorkorderKey);

    $scope.myPromise = $http.get(HOSTNAME + "/delayCurrentWorkOrder?WorkorderKey=" + WorkorderKey + "&emp=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
      .success(function () {
        var alertPopup = $ionicPopup.alert({
          title: 'Delay',
          template: 'Work order has been Delayed!'
        });
        $timeout(function () {
          $ionicLoading.hide();
          alertPopup.close();
          // uploadingPopup.close();
        }, 1000);

        console.log("delayCurrentWorkOrder in delay workorderkey" + $rootScope.workorderkey);
        if (profile.role === 'Manager') {
          $state.go('managerDashboard.managerViewWorkorder');
        }
        else if (profile.role == 'Supervisor') {
          $state.go('supervisorDashboard.supervisorworks');
        }
        else if (profile.role == 'Employee') {
          $state.go('employeeDashboard.employeeworks');
        }

      })

  };


  $scope.continueCurrentWorkOrder = function (WorkorderKey) {


    console.log("continueCurrentWorkOrder in delay " + WorkorderKey);

    $scope.myPromise = $http.get(HOSTNAME + "/continueCurrentWorkOrder?WorkorderKey=" + WorkorderKey + "&emp=" + $scope.toServeremployeekey + "&OrganizationID=" + $scope.OrganizationID)
      .success(function () {


        console.log("delayCurrentWorkOrder in delay workorderkey" + WorkorderKey);
        //        if (profile.role === 'Manager') {
        //          $state.go('managerDashboard.managerViewWorkorder');
        //        }
        //        else if (profile.role == 'Supervisor' ) {
        //          $state.go('supervisorDashboard.supervisorworks');
        //        }
        //        else if (profile.role == 'Employee' ) {
        //          $state.go('employeeDashboard.employeeworks');
        //        }
        $scope.getWorkorderDetails();
      })



  };


  $interval(function () {

    $scope.isDoubleScanDisabled = true;

  }, 5000);



  $scope.scrollToTop();
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
  $scope.today_DT = convert_DT(new Date());

  $scope.getBackgroundGeolocation = function (employeekey) {
    console.log("inside getBackgroundGolocation ");
    // var currDT = convert_DT_Time(new Date());
    // console.log("inside quick workorder startDT " + currDT);
    // alert('employeekey'+employeekey);
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

    $ionicPlatform.ready(function () {

      console.log("[IONIC PLATFORM IS NOW READY]");

      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      // console.log("pos"+pos);
      function success(pos) {
        console.log("Inside function success");
        var crd = pos.coords;
        $rootScope.geolatitude = crd.latitude;
        $rootScope.geolongitude = crd.longitude;
        console.log('Your current position is:');
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        // console.log('employeekey: ' + employeekey);
        // console.log('More or less ' + crd.accuracy + ' meters.');
        $scope.backgroundlocation = {};
        $scope.backgroundlocation.geolatitude = $rootScope.geolatitude;
        $scope.backgroundlocation.geolongitude = $rootScope.geolongitude;
        $scope.backgroundlocation.EmployeeKey = employeekey;
        $scope.backgroundlocation.WorkOrderKey = workorderkey_viewDetails;
        // $scope.backgroundlocation.currenttime = currDT;
        $scope.backgroundlocation.systime = p;
        $scope.backgroundlocation.OrganizationID = $scope.OrganizationID;
        console.log($scope.backgroundlocation.WorkOrderKey);
        $http.post(HOSTNAME + "/gpsSnapShot", $scope.backgroundlocation).success(function () {
          $scope.getWorkorderDetails();
        });

      };

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
      //  navigator.Geolocation.getCurrentPosition(success, error,options).then(resp => {
      //     console.log('resp');
      //   }, (err) => {
      //     console.log('Geolocation err: ');
      //     console.log(err);
      //   });

    });
  };

  $scope.locationTracker = function () {
    console.log("Entering function");
    console.log("EmployeeKey" + $scope.toServeremployeekey);
    $scope.getBackgroundGeolocation($scope.toServeremployeekey);
  }
  $scope.snapshot = function () {

  }
  $scope.createEmployeeWorkorderByBarcode = function () {
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
                    $state.go('supervisorDashboard.createWorkOrderbyRoomScaning', { roomKey: $scope.scannedBarcode });
                  }
                  else if (profile.role == 'Employee') {
                    $state.go('employeeDashboard.createWorkOrderbyRoomScaning', { roomKey: $scope.scannedBarcode });
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
  $scope.cancelWorkOrder = function (Reason) {
    console.log(" cancel " + Reason);
    var t = new Date();
    var h = t.getHours();
    var mi = t.getMinutes();
    var s = t.getSeconds();

    $scope.today_DT = convert_DT(new Date());
    var p = "";
    p = h + ":" + mi + ":" + s;
    var reason;
    if (Reason) {
      reason = Reason;
    }
    else {
      reason = '';
    }

    $scope.cancelWO = {};
    $scope.cancelWO.workOrderKey = $stateParams.workorderKey;
    $scope.cancelWO.Reason = reason;
    $scope.cancelWO.updateDate = $scope.today_DT;
    $scope.cancelWO.updateTime = p;
    $scope.cancelWO.empKey = $scope.toServeremployeekey;
    $scope.cancelWO.OrganizationID = $scope.OrganizationID;
    console.log(" reason " + $scope.cancelWO.Reason);
    $scope.myPromise = $http.post(HOSTNAME + "/mob_cancelWorkOrder", $scope.cancelWO).success(function (response) {

      var alertPopup = $ionicPopup.alert({
        title: 'workorder Cancel',
        template: 'Work order has been cancelled !'
      });
      $timeout(function () {
        $ionicLoading.hide();
        alertPopup.close();
        // uploadingPopup.close();
        if (profile.role == 'Supervisor') {
          $state.go('supervisorDashboard.detailedWorkorderView', { workorderKey: $stateParams.workorderKey });
        }
        else if (profile.role == 'Employee') {
          $state.go('employeeDashboard.detailedWorkorderView', { workorderKey: $stateParams.workorderKey });
        }
        else if (profile.role == 'Manager') {
          $state.go('managerDashboard.detailedWorkorderView', { workorderKey: $stateParams.workorderKey });
        }
      }, 1000);


    });;
  }
  document.addEventListener("backbutton", function () {
    // pass exitApp as callbacks to the switchOff method
    window.plugins.flashlight.switchOff();
  }, false);
  document.addEventListener("deviceready", function (){
                                                   window.screen.orientation.unlock(); // or ‘portrait’
                                                   }, false);
});


