myApp.controller('inspectionEditCtrl', ['HOSTNAME', '$ionicLoading', '$scope', '$http', '$state', '$rootScope', '$ionicScrollDelegate', '$ionicPopup', '$window', 'savingInspectedValuesService', '$timeout', '$ionicPlatform', '$cordovaFile', '$ionicActionSheet', '$cordovaFileTransfer', '$ionicModal', '$ionicSlideBoxDelegate', '$stateParams', '$cordovaCamera', '$filter', 'ionicDatePicker', 'ionicTimePicker', function (HOSTNAME, $ionicLoading, $scope, $http, $state, $rootScope, $ionicScrollDelegate, $ionicPopup, $window, savingInspectedValuesService, $timeout, $ionicPlatform, $cordovaFile, $ionicActionSheet, $cordovaFileTransfer, $ionicModal, $ionicSlideBoxDelegate, $stateParams, $cordovaCamera, $filter, ionicDatePicker, ionicTimePicker) {
    var employeekey = window.localStorage.getItem("employeekey");
    $scope.welcome = 'Welcome ' + employeekey + ' ';
    var token = window.localStorage.getItem('token');
    $window.localStorage['token'] = token;
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(url_base64_decode(encodedProfile));
    console.log("//////////////////   inspectionEditCtrl ///////////////////");
    $scope.toServeremployeekey = profile.employeekey;
    $scope.OrganizationID = profile.OrganizationID;
    $scope.userRole = profile.role;
    $scope.imgFlag = false;
    $scope.imguploadFlag = false;

    $scope.getBackgroundGeolocation($scope.toServeremployeekey);
    $scope.scrollMainToTop = function () {
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    };
    $scope.scrollSmallToTop = function () {
        $ionicScrollDelegate.$getByHandle('small').scrollTop();
    };

    $scope.dateValue = convert_DT(new Date());

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
    $scope.scrollToTop = function () { //ng-click for back to top button
        $ionicScrollDelegate.scrollTop();
        $scope.sttButton = false;  //hide the button when reached top
    };
    $rootScope.toServeremployeekey = profile.employeekey;
    $scope.scrollToTop();
    $scope.questionsCount = 0;
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
    // inspectionCompletion.isMailRequired
    $scope.inspectionCompletion = {};
    $scope.inpectionValues = {};
    var InspectionorderKey = $rootScope.inspectKey;
    var templateId = $rootScope.templID;

    $scope.TemplateName = $rootScope.templName;
    $scope.TemplateId = templateId;
    console.log("$scope.toServeremployeekey " + $scope.toServeremployeekey + "$scope.TemplateId " + $scope.TemplateId);
    console.log("InspectionorderKey..." + InspectionorderKey);
    var questions = [];
    if ($scope.TemplateId) {
        // $ionicLoading.show();
        $scope.myPromise = $http.get(HOSTNAME + "/mob_getPickValuesListForInspection?OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                $scope.picklistDrop = response;
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
        $scope.myPromise = $http.get(HOSTNAME + "/getTemplateQuestions?templateId=" + templateId + "&OrganizationID=" + $scope.OrganizationID)
            .success(function (response) {
                if (response.message == "Failed to authenticate token.") {
                    // checking Session expired redirected to login screen
                    var alertPopup2 = $ionicPopup.alert({
                        title: 'Session expired',
                        template: 'Please relogin!'
                    });
                    $timeout(function () {
                        $ionicLoading.hide();
                        alertPopup2.close();
                        // uploadingPopup.close();
                    }, 1000);
                    $state.go('login');
                }

                $scope.scrollToTop();
                // $ionicLoading.hide();
                questions = response;
                $scope.templateQuestions = response;
                var count = 0;
                $scope.questionsCount = questions.length;
                // console.log($scope.templateQuestions);
                for (var i = 0; i < questions.length; i++, count++) {
                    // console.log("selected qstns are " + questions[i].TemplateQuestionID);
                    $scope.myPromise = $http.get(HOSTNAME + "/getInspectionorder?InspectionorderKey=" + InspectionorderKey + "&OrganizationID=" + $scope.OrganizationID)
                        .success(function (response) {
                            // $ionicLoading.hide();
                            if (response.message == "Failed to authenticate token.") {
                                // checking Session expired redirected to login screen
                                var alertPopup2 = $ionicPopup.alert({
                                    title: 'Session expired',
                                    template: 'Please relogin!'
                                });
                                $timeout(function () {
                                    $ionicLoading.hide();
                                    alertPopup2.close();
                                    // uploadingPopup.close();
                                }, 1000);
                                $state.go('login');
                            }

                            $scope.inspectionorder = response;
                            $scope.facility = response[0].FacilityName;
                            $scope.floorname = response[0].FloorName;
                            $scope.zonename = response[0].ZoneName;
                            $scope.roomid = response[0].RoomId;
                            $rootScope.val = response;
                            $scope.inpectionValues.ScoreName = $scope.inspectionorder[0].ScoreName;
                            $scope.inpectionValues.TemplateQuestionID = $scope.inspectionorder[0].TemplateQuestionID;
                            $scope.inpectionValues.InspectionOrderKey = $scope.inspectionorder[0].InspectionOrderKey;
                            $scope.inpectionValues.TemplateID = $scope.inspectionorder[0].TemplateID;
                            $scope.inpectionValues.ScoreTypeKey = $scope.inspectionorder[0].ScoreTypeKey;
                            $scope.empMail = response[0].employeeID

                            // console.log($scope.inpectionValues);

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

            });
    }
    else {
        var alertPopup = $ionicPopup.alert({
            title: 'Something went Wrong',
            template: 'Please try again!'
        });
        $timeout(function () {
            $ionicLoading.hide();
            alertPopup.close();
            // uploadingPopup.close();
        }, 1000);
        if ($scope.userRole == 'Manager') {

            $state.go('managerDashboard.createInspection');
        }
        else {
            $state.go('supervisorDashboard.inspectionorderProvided');
        }

    }

    /*START Saving inpected values */


    function convert_DT(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    ;
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
    };
    function arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j]) {
                    a.splice(j--, 1);
                }
            }
        }
        return a;
    };
    function lastIndex(array, val) {
        // debugger;
        var a = [];
        a = array;
        var b = val;
        var z = null;
        for (var i = 0; i < a.length; i++) {
            if (b == a[i])
                z = i;
        }
        return z;
    }
    $scope.Scoringtype = { ratingValue: [], inspectionNotes: [], rating_yn: [], observationdef: [], correctiveaction: [], completeddate: [] };
    $scope.today_DT = convert_DT(new Date());
    $scope.templateQuestionvalues = {};
    $scope.count = 0;
    $scope.saveInspection = {};
    $scope.saveRatings = function (templateQuestionId, scoreName) {
        if (scoreName === 'Yes/No' || scoreName === 'Pass/Fail' || scoreName === '0-25') {
            // console.log($scope.Scoringtype);
            var length = Object.keys($scope.Scoringtype.rating_yn).length;
            var arrayLength = $scope.Scoringtype.rating_yn.length;
            var value = $scope.Scoringtype.rating_yn[arrayLength - 1];
            $scope.Scoringtype.ratingValue.push({ rating: value, questionID: templateQuestionId });
        } else {
            $scope.Scoringtype.ratingValue.push({ rating: $rootScope.rating, questionID: templateQuestionId });
        }
        console.log($scope.Scoringtype);
    };

    $scope.inspectionCompleted = function (scoreName, templateQuestionId, inspectionorderKey, templateId) {

        console.log(" ismail ******** " + $scope.inspectionCompletion.isMailRequired);


        var temp = [];
        var choices1 = [];
        choices1 = $scope.Scoringtype;
        console.log(choices1);
        // console.log("qstn length "+$scope.questionsCount);
        var totalQuestions = $scope.questionsCount;
        var indexObj = [];
        var ratingIndexlist = [];
        var noteIndexList = [];
        var questionidList = [];
        var observationdefIndexlist = [];
        var correctiveactionIndexlist = [];
        var completeddateIndexlist = [];
        console.log("imguploadFlag" + $scope.imguploadFlag);
        if ($scope.imgFlag) {
            if (!($scope.imguploadFlag)) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Inspection',
                    template: 'Please Upload photo!'
                });
                return;
            }
        }
        if (scoreName === 'Yes/No' || scoreName === 'Pass/Fail' || scoreName === '0-25') {
            for (var j = 0; j < $rootScope.val.length; j++) {
                temp.push("" + $rootScope.val[j].TemplateQuestionID);
            }
            ratingIndexlist = Object.keys(choices1.rating_yn);
            noteIndexList = Object.keys(choices1.inspectionNotes);
            observationdefIndexlist = Object.keys(choices1.observationdef);
            correctiveactionIndexlist = Object.keys(choices1.correctiveaction);
            completeddateIndexlist = Object.keys(choices1.completeddate);
            questionidList = arrayUnique(ratingIndexlist.concat(temp));
            // console.log(questionidList);
        }
        else {
            noteIndexList = Object.keys(choices1.inspectionNotes);
            observationdefIndexlist = Object.keys(choices1.observationdef);
            correctiveactionIndexlist = Object.keys(choices1.correctiveaction);
            completeddateIndexlist = Object.keys(choices1.completeddate);
            indexObj = choices1.ratingValue;
            if (indexObj) {
                for (var j = 0; j < indexObj.length; j++) {
                    // if(indexObj[j].rating == 0)
                    ratingIndexlist.push("" + indexObj[j].questionID);
                }
            }
            // console.log("We go the notes in index "+noteIndexList+" and value "+$scope.Scoringtype.inspectionNotes[noteIndexList]);
            questionidList = arrayUnique(noteIndexList.concat(ratingIndexlist));
            // console.log(questionidList);
        }
        if (questionidList.length === totalQuestions && scoreName === 'Pass/Fail') {
            var questionValues = "Pass";
            var starRating = null;
            var notes = null;
            var iobservationdef = null;
            var icorrectiveaction = null;
            var icompleteddate = null;
            var questionid = null;
            var i = 0;
            var j = 0;
            var k = 0;

            for (i = i; i < questionidList.length; i++) {// includes actual qn ids
                $scope.saveInspection = {};
                questionValues = "Pass";
                notes = null;
                iobservationdef = null;
                icorrectiveaction = null;
                icompleteddate = null;
                questionid = questionidList[i];
                for (j = 0; j < noteIndexList.length; j++) {
                    if (noteIndexList[j] === questionid) {
                        notes = $scope.Scoringtype.inspectionNotes[questionid];
                        iobservationdef = $scope.Scoringtype.observationdef[questionid];
                        icorrectiveaction = $scope.Scoringtype.correctiveaction[questionid];
                        icompleteddate = $scope.Scoringtype.completeddate[questionid];

                        console.log("Pra1: " + iobservationdef + "..." + icorrectiveaction + "..." + icompleteddate);

                        console.log("Aneesh got note inside if as " + notes + " " + questionid + " " + " questionidList" + questionidList.length + $scope.Scoringtype.inspectionNotes);
                        break;
                    }

                }

                for (k = 0; k < ratingIndexlist.length; k++) {
                    var lastIndexValue = [];
                    if (ratingIndexlist[k] === questionid) {
                        lastIndexValue = lastIndex(ratingIndexlist, questionidList[i]);
                        // console.log("last indexfor "+ratingIndexlist[k] +" is " + lastIndexValue);

                        if (lastIndexValue !== null) {
                            questionValues = $scope.Scoringtype.ratingValue[lastIndexValue].rating;
                        } else {
                            questionValues = "Pass";
                        }
                        break;
                    }

                }
                if (icompleteddate) {
                    $scope.saveInspection.CompletedDate = convert_DT(icompleteddate);
                }
                else {
                    $scope.saveInspection.CompletedDate = convert_DT(new Date());
                }
                $scope.saveInspection.employeekey = $scope.toServeremployeekey;
                $scope.saveInspection.inspectionkey = inspectionorderKey;
                $scope.saveInspection.templateid = templateId;
                $scope.saveInspection.questionid = questionid;
                $scope.saveInspection.inspectionnotes = notes;
                $scope.saveInspection.templateQstnValues = questionValues;
                $scope.saveInspection.OrganizationID = $scope.OrganizationID;
                $scope.saveInspection.ObservationDeficiency = iobservationdef;
                $scope.saveInspection.CorrectiveAction = icorrectiveaction;
                //                $scope.saveInspection.CompletedDate = icompleteddate;

                console.log("Pra2: " + $scope.saveInspection.ObservationDeficiency + "..." + $scope.saveInspection.CorrectiveAction + "..." + $scope.saveInspection.CompletedDate);
                console.log("saveInspection ........ ***********  " + $scope.saveInspection.employeekey + " *** " + $scope.saveInspection.inspectionkey + " ***** " + $scope.saveInspection.templateid + " ***** " + $scope.saveInspection.questionid + " ****** " + $scope.saveInspection.inspectionnotes + " ########### " + $scope.saveInspection.templateQstnValues + " @@@@@@@@@@ " + $scope.OrganizationID);

                // $http.post(HOSTNAME+ "/saveinspectedQuestions?employeekey="+$scope.saveInspection.employeekey+"&inspectionkey="+$scope.saveInspection.inspectionkey+"&templateid="+$scope.saveInspection.templateid+"&questionid="+$scope.saveInspection.questionid+"&inspectionnotes="+$scope.saveInspection.inspectionnotes+"&templateQstnValues="+$scope.saveInspection.templateQstnValues+"&OrganizationID="+$scope.OrganizationID);
                // old code - passing value by url
                $scope.myPromise = $http.post(HOSTNAME + "/mobsaveinspectedQuestions", $scope.saveInspection);
                console.log("**  saveInspection ***" + $scope.saveInspection.questionid);
            }
            var alertPopup = $ionicPopup.alert({
                title: 'Inspection',
                template: 'Inspection Submitted Successfully!'
            });
            $scope.completedInspection = {};
            $scope.completedInspection.InspectionorderKey = inspectionorderKey;
            $scope.completedInspection.EmployeeKey = $scope.toServeremployeekey;
            $scope.completedInspection.OrganizationID = $scope.OrganizationID;
            console.log($scope.completedInspection.InspectionorderKey + "... " + $scope.completedInspection.EmployeeKey + ".... ");
            $http.post(HOSTNAME + "/inspectionCompleted", $scope.completedInspection).success(function (response) {

                if ($scope.userRole == 'Manager') {
                    $state.go('managerDashboard.afterInspectionManagerView', { inspectionorderkey: InspectionorderKey });
                }
                else {
                    $state.go('supervisorDashboard.inspectionorderProvided');
                }
            });
        }
        else if (questionidList.length === totalQuestions && scoreName !== 'Pass/Fail') {
            var questionValues = null;
            var starRating = null;
            var notes = null;
            var iobservationdef = null;
            var icorrectiveaction = null;
            var icompleteddate = null;
            var questionid = null;
            var i = 0;
            var j = 0;
            var k = 0;

            for (i = i; i < questionidList.length; i++) {// includes actual qn ids
                questionValues = null;
                notes = null;
                iobservationdef = null;
                icorrectiveaction = null;
                icompleteddate = null;
                questionid = questionidList[i];
                for (j = 0; j < noteIndexList.length; j++) {
                    if (noteIndexList[j] === questionid) {
                        notes = $scope.Scoringtype.inspectionNotes[questionid];
                        iobservationdef = $scope.Scoringtype.observationdef[questionid];
                        icorrectiveaction = $scope.Scoringtype.correctiveaction[questionid];
                        icompleteddate = $scope.Scoringtype.completeddate[questionid];
                        // console.log("Aneesh got note inside if as "+notes+" "+questionid+" "+" questionidList"+questionidList.length+$scope.Scoringtype.inspectionNotes);
                        break;
                    }

                }

                for (k = 0; k < ratingIndexlist.length; k++) {
                    var lastIndexValue = [];
                    if (ratingIndexlist[k] === questionid) {
                        lastIndexValue = lastIndex(ratingIndexlist, questionidList[i]);
                        // console.log("last indexfor "+ratingIndexlist[k] +" is " + lastIndexValue);
                        // var x= lastIndexValue.length - ratingIndexlist.length;
                        if (lastIndexValue != null) {
                            questionValues = $scope.Scoringtype.ratingValue[lastIndexValue].rating;
                        } else {
                            questionValues = null;
                        }
                        break;
                    }

                }
                if (icompleteddate) {
                    $scope.saveInspection.CompletedDate = convert_DT(icompleteddate);
                }
                else {
                    $scope.saveInspection.CompletedDate = convert_DT(new Date());
                }
                $scope.saveInspection.employeekey = $scope.toServeremployeekey;
                $scope.saveInspection.inspectionkey = inspectionorderKey;
                $scope.saveInspection.templateid = templateId;
                $scope.saveInspection.questionid = questionid;
                $scope.saveInspection.inspectionnotes = notes;
                $scope.saveInspection.templateQstnValues = questionValues;
                $scope.saveInspection.ObservationDeficiency = iobservationdef;
                $scope.saveInspection.CorrectiveAction = icorrectiveaction;
                //                $scope.saveInspection.CompletedDate = icompleteddate;

                console.log("Pra2: " + $scope.saveInspection.ObservationDeficiency + "..." + $scope.saveInspection.CorrectiveAction + "..." + $scope.saveInspection.CompletedDate);
                console.log("saveInspection" + $scope.saveInspection.questionid + ".." + $scope.saveInspection.inspectionnotes + ".." + $scope.saveInspection.templateQstnValues);
                // savingInspectedValuesService.saveinspectedQuestions($scope.saveInspection);
                // console.log("posting count  " +i);
                $scope.InpecValue = {};
                $scope.InpecValue.employeekey = $scope.saveInspection.employeekey;
                $scope.InpecValue.inspectionkey = $scope.saveInspection.inspectionkey;
                $scope.InpecValue.templateid = $scope.saveInspection.templateid;
                $scope.InpecValue.questionid = $scope.saveInspection.questionid;
                $scope.InpecValue.inspectionnotes = $scope.saveInspection.inspectionnotes;
                $scope.InpecValue.templateQstnValues = $scope.saveInspection.templateQstnValues;
                $scope.InpecValue.OrganizationID = $scope.OrganizationID;
                $scope.InpecValue.ObservationDeficiency = $scope.saveInspection.ObservationDeficiency;
                $scope.InpecValue.CorrectiveAction = $scope.saveInspection.CorrectiveAction;
                $scope.InpecValue.CompletedDate = $scope.saveInspection.CompletedDate;
                // $http.post(HOSTNAME+ "/saveinspectedQuestions?employeekey="+$scope.saveInspection.employeekey+"&inspectionkey="+$scope.saveInspection.inspectionkey+"&templateid="+$scope.saveInspection.templateid+"&questionid="+$scope.saveInspection.questionid+"&inspectionnotes="+$scope.saveInspection.inspectionnotes+"&templateQstnValues="+$scope.saveInspection.templateQstnValues+"&OrganizationID="+$scope.OrganizationID);
                // old code - passing value by url
                $scope.myPromise = $http.post(HOSTNAME + "/mobsaveinspectedQuestions", $scope.InpecValue);
                // $timeout(function() {
                //         $ionicLoading.hide();
                //           console.log($scope.saveInspection);
                //            }, 1000);


            }
            var alertPopup = $ionicPopup.alert({
                title: 'Inspection',
                template: 'Inspection Submitted Successfully!'
            });

            $scope.completedInspection = {};
            $scope.completedInspection.InspectionorderKey = inspectionorderKey;
            $scope.completedInspection.EmployeeKey = $rootScope.toServeremployeekey;
            $scope.completedInspection.OrganizationID = $scope.OrganizationID;
            $scope.myPromise = $http.post(HOSTNAME + "/inspectionCompleted", $scope.completedInspection).success(function (response) {
                ;
                if ($scope.userRole == 'Manager') {
                    $state.go('managerDashboard.afterInspectionManagerView', { inspectionorderkey: InspectionorderKey });
                }
                else {
                    $state.go('supervisorDashboard.inspectionorderProvided');
                }
            });
        }
        if (questionidList.length !== totalQuestions) {
            var alertPopup = $ionicPopup.alert({
                title: 'Inspection',
                template: 'Some questions are not answered!'
            });
            return;
        }
        $timeout(function () {
            $ionicLoading.hide();
            alertPopup.close();
            // uploadingPopup.close();
        }, 1000);

        console.log("ismail " + $scope.inspectionCompletion.isMailRequired + ".." + $scope.empMail);
        if ($scope.inspectionCompletion.isMailRequired) {
            cordova.plugins.email.isAvailable(
                function (isAvailable) {
                    console.log('Email Service is not available');
                }
            );
            console.log("inside ismail " + $scope.inspectionCompletion.isMailRequired + ".." + $scope.empMail);


            $scope.myPromise = $http.get(HOSTNAME + "/getEmailIdByEmp?employeekey=" + $scope.empMail + "&OrganizationID=" + $scope.OrganizationID)
                .success(function (response) {
                    if (response.message == "Failed to authenticate token.") {
                        // checking Session expired redirected to login screen
                        var alertPopup2 = $ionicPopup.alert({
                            title: 'Session expired',
                            template: 'Please relogin!'
                        });
                        $timeout(function () {
                            $ionicLoading.hide();
                            alertPopup2.close();
                            // uploadingPopup.close();
                        }, 1000);
                        $state.go('login');
                    }

                    $scope.EmailId = response[0].EmailID;
                    console.log("Email id " + $scope.EmailId);
                    console.log("inspectionorderKey " + inspectionorderKey)

                    $scope.myPromise = $http.get(HOSTNAME + "/getInspectionDetailsForEmail?inspectionorderKey=" + inspectionorderKey + "&OrganizationID=" + $scope.OrganizationID)
                        .success(function (response) {
                            if (response.message == "Failed to authenticate token.") {
                                // checking Session expired redirected to login screen
                                var alertPopup2 = $ionicPopup.alert({
                                    title: 'Session expired',
                                    template: 'Please relogin!'
                                });
                                $timeout(function () {
                                    $ionicLoading.hide();
                                    alertPopup2.close();
                                    // uploadingPopup.close();
                                }, 1000);
                                $state.go('login');
                            }

                            $scope.inspectionEmail = response;
                            console.log('Email TemplateName' + $scope.inspectionEmail[0].TemplateName);
                            var emailBody;
                            emailBody = '<b>' + $scope.inspectionEmail[0].TemplateName + '</b>' + '(' + $scope.inspectionEmail[0].ScoreName + ')' + '<br>'

                            for (var i = 0; i < response.length; i++) {
                                emailBody = emailBody + $scope.inspectionEmail[i].Question + ' : ' + $scope.inspectionEmail[i].Value + '<br>';

                            }

                            cordova.plugins.email.open({
                                to: $scope.EmailId,
                                // cc:      'erika@mustermann.de',
                                // bcc:     ['john@doe.com', 'jane@doe.com'],
                                subject: 'Inspection By -' + $scope.inspectionEmail[0].InspectorName,
                                body: emailBody
                            });
                        });
                });


        }


    };

    $scope.rating = 0;
    $scope.rating3 = 0;
    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',
        iconOff: 'ion-ios-star-outline',
        iconOnColor: 'rgb(255,140,0)',  //Optional
        iconOffColor: 'rgb(255,140,0)',
        rating: 0,
        minRating: 0,
        maxRating: 5,
        callback: function (rating) {

            $scope.ratingsCallback(rating);

        }
    };

    $scope.ratingsCallback = function (rating) {
        // console.log('Selected rating is : ', rating);
        $rootScope.rating = rating;
    };
    $scope.Scoringtype.ratingValue = [];
    $scope.ratingsObject3Star = {
        iconOn: 'ion-ios-star',
        iconOff: 'ion-ios-star-outline',
        iconOnColor: 'rgb(255,140,0)',  //Optional
        iconOffColor: 'rgb(255,140,0)',
        rating3: 0,
        minRating: 0,
        maxRating: 3,
        callback: function (rating3) {

            $scope.ratingsCallback3star(rating3);

            // $scope.Scoringtype.ratingValue.push(rating3);
        }
    };

    $scope.ratingsCallback3star = function (rating3) {
        // console.log('Selected rating is : ', rating3);
        $rootScope.rating = rating3;

    };

    $scope.loadImage = function () {
        var options;
        var sourceType = null;
        $scope.imgFlag = true;
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
                //                if (index === 0) {
                //                    // add edit 1 code
                //
                //                    options = {
                //                        quality: 45,
                //                        destinationType: Camera.DestinationType.FILE_URI,
                //                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                //                        // allowEdit: true,
                //                        encodingType: Camera.EncodingType.JPEG,
                //                        // targetWidth: 100,
                //                        // targetHeight:100,
                //                        popoverOptions: CameraPopoverOptions,
                //                        saveToPhotoAlbum: true
                //                    }
                //                    // console.log("gallery"+$scope.workorderkey+".."+index);
                //                    // $scope.captureImage($rootScope.workorderkey);
                //
                //                }

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

    $scope.uploadImage = function () {
        console.log("uploadflag  " + $scope.uploadFlag);
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
            var url = HOSTNAME + "/uploadImageFromSmallDevices_Inspection";

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
                    $scope.imguploadFlag = true;
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
                    $scope.myPromise = $http.get(HOSTNAME + "/inspectionPhotoUpload?InspectionOrderKey=" + $rootScope.inspectKey + "&empkey=" + $scope.toServeremployeekey + "&Filename=" + filename + "&OrganizationId=" + $scope.OrganizationID)
                        .success(function (response) {
                            $scope.ImageList = response;
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
                    // console.log($scope.uploadPhoto);
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

    $scope.pathForImage = function (image) {
        if (image === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + image;
        }
    };




    // $scope.yesNoScoringTypeInspection = function(notes,questionid,choices,inspectionorderkey,templateid,index){
    //     $scope.count = $scope.count+1;
    //         // alert(notes+".."+questionid+".."+choices+".."+inspectionorderkey+".."+templateid);
    //         if(notes){
    //             $scope.templateQuestionvalues.inspectionnotes = notes;

    //         }
    //         else{
    //             $scope.templateQuestionvalues.inspectionnotes = null;
    //             var alertPopup = $ionicPopup.alert({
    //                                                 title: 'WARNING!!!',
    //                                                 template: 'Inspection note is not provided!'
    //                                               });
    //             return;
    //         }
    //         // debugger;
    //         if(choices){
    //             $scope.templateQuestionvalues.templateQstnValues = choices;
    //         }
    //         else{
    //             $scope.templateQuestionvalues.templateQstnValues = null;
    //             var alertPopup = $ionicPopup.alert({
    //                                                 title: 'WARNING!!!',
    //                                                 template: 'Scoring type is not provided!'
    //                                               });
    //             return;
    //         }
    //         if(notes && choices){
    //             var alertPopup = $ionicPopup.alert({
    //                                                 title: 'Success',
    //                                                 template: 'Saved Question '+index +'!'
    //                                               });
    //         }
    //         // $scope.Scoringtype.inspectionNotesforYes_No = null;
    //         $scope.templateQuestionvalues.questionid = questionid;
    //         $scope.templateQuestionvalues.inspectionkey = inspectionorderkey;
    //         $scope.templateQuestionvalues.templateid = templateid;
    //         // console.log($scope.templateQuestionvalues);
    //         // alert($scope.templateQuestionvalues.inspectionnotes+".."+$scope.templateQuestionvalues.questionid+".."+$scope.templateQuestionvalues.templateQstnValues+".."+$scope.templateQuestionvalues.inspectionkey+"...."+$scope.templateQuestionvalues.templateid);

    //         $scope.saveInspectedValues();
    // };
    // $scope.count = 0;
    // $scope.fiveStarScoringTypeInspection = function(notes,questionid,choices,inspectionorderkey,templateid,index){
    //         // alert(notes+".."+questionid+".."+choices+".."+inspectionorderkey+".."+templateid);
    //         // debugger;
    //         $scope.count = $scope.count+1;
    //         // console.log("inside 5 star"+$scope.count);
    //         if(notes){
    //             $scope.templateQuestionvalues.inspectionnotes = notes;
    //             var alertPopup = $ionicPopup.alert({
    //                                                 title: 'Success',
    //                                                 template: 'Saved Question '+index +'!'
    //                                               });
    //         }
    //         else{
    //             $scope.templateQuestionvalues.inspectionnotes = null;
    //             var alertPopup = $ionicPopup.alert({
    //                                                 title: 'WARNING!!!',
    //                                                 template: 'Inspection note is not provided!'
    //                                              });
    //             return;
    //         }
    //         if($rootScope.rating){
    //             $scope.templateQuestionvalues.templateQstnValues = $rootScope.rating ;
    //         }
    //         else{
    //             $scope.templateQuestionvalues.templateQstnValues = 1 ;
    //         }

    //         $scope.templateQuestionvalues.questionid = questionid;
    //         $scope.templateQuestionvalues.inspectionkey = inspectionorderkey;
    //         $scope.templateQuestionvalues.templateid = templateid;
    //         // console.log($scope.templateQuestionvalues);
    //         // $scope.Scoringtype.inspectionNotesfor5stars = null;
    //         // $scope.rating5star = 0;
    //         // alert("fiveStarScoringTypeInspection "+$scope.templateQuestionvalues.inspectionnotes+".."+$scope.templateQuestionvalues.questionid+".."+$scope.templateQuestionvalues.templateQstnValues+".."+$scope.templateQuestionvalues.inspectionkey+"...."+$scope.templateQuestionvalues.templateid);

    //         $scope.saveInspectedValues();
    // };
    // $scope.threeStarScoringTypeInspection = function(notes,questionid,choices,inspectionorderkey,templateid,index){
    //         // debugger;
    //         $scope.count = $scope.count+1;
    //         // console.log("inside 5 star"+$scope.count);
    //         if(notes){
    //             $scope.templateQuestionvalues.inspectionnotes = notes;

    //             var alertPopup = $ionicPopup.alert({
    //                                                 title: 'Success',
    //                                                 template: 'Saved Question '+index +'!'
    //                                               });
    //         }
    //         else{
    //             $scope.templateQuestionvalues.inspectionnotes = null;
    //             var alertPopup = $ionicPopup.alert({
    //                                                 title: 'WARNING!!!',
    //                                                 template: 'Inspection note is not provided!'
    //                                               });
    //             return;
    //         }
    //         if($rootScope.rating3){
    //             $scope.templateQuestionvalues.templateQstnValues = $rootScope.rating3;
    //         }
    //         else{
    //             $scope.templateQuestionvalues.templateQstnValues = 1;
    //         }

    //         $scope.templateQuestionvalues.questionid = questionid;
    //         $scope.templateQuestionvalues.inspectionkey = inspectionorderkey;
    //         $scope.templateQuestionvalues.templateid = templateid;
    //         // console.log($scope.templateQuestionvalues.templateQstnValues);
    //         // $scope.Scoringtype.inspectionNotesfor3stars = null;
    //         // $scope.rating3star = 0;
    //         // alert("threeStarScoringTypeInspection "+$scope.templateQuestionvalues.inspectionnotes+".."+$scope.templateQuestionvalues.questionid+".."+$scope.templateQuestionvalues.templateQstnValues+".."+$scope.templateQuestionvalues.inspectionkey+"...."+$scope.templateQuestionvalues.templateid);

    //         $scope.saveInspectedValues();
    // };
    // $scope.saveInspectedValues = function(){
    //     $scope.scrollToTop();
    //     $scope.templateQuestionvalues.employeekey = $scope.toServeremployeekey;
    //         // console.log($scope.templateQuestionvalues);
    //         // alert($scope.templateQuestionvalues.inspectionnotes+".."+$scope.templateQuestionvalues.questionid+".."+$scope.templateQuestionvalues.templateQstnValues+".."+$scope.templateQuestionvalues.inspectionkey+"...."+$scope.templateQuestionvalues.templateid);

    //         $http.post(HOSTNAME+ "/saveinspectedQuestions",$scope.templateQuestionvalues);
    //         // $scope.templateQuestionvalues.inspectionnotes = null;
    //         // $scope.templateQuestionvalues.templateQstnValues = null;

    // };


    //             $scope.rating5star = 0;
    //             $scope.rating3star = 0;


    // $scope.ratingsObjectfor3star = {
    //     iconOn: 'ion-ios-star', //Optional
    //     iconOff: 'ion-ios-star-outline',  //Optional
    //     iconOnColor: 'rgb(255,140,0)',  //Optional
    //     iconOffColor:  'rgb(255,140,0)',    //Optional
    //     rating3star: 1,  //Optional
    //     minRating: 1, //Optional
    //     maxRating: 3,
    //     readOnly:false, //Optional
    //     callback: function(rating3star) {  //Mandatory
    //       $scope.ratingsCallback3star(rating3star);
    //     }
    //   };
    // $scope.ratingsObjectfor5star = {
    //     iconOn: 'ion-ios-star', //Optional
    //     iconOff: 'ion-ios-star-outline',  //Optional
    //     iconOnColor: 'rgb(255,140,0)',  //Optional
    //     iconOffColor:  'rgb(255,140,0)',    //Optional
    //     rating5star: 1,  //Optional
    //     minRating: 1, //Optional
    //     readOnly:false, //Optional
    //     callback: function(rating5star) {  //Mandatory
    //       $scope.ratingsCallback5star(rating5star);
    //     }
    //   };
    //   // $scope.ratingsCallback = function(rating) {
    //   //   // $scope.starRating = rating;
    //   //   console.log('Selected rating is : ', rating);
    //   // };
    //         $scope.ratingsCallback3star = function(rating3star){
    //             $scope.rating5star = rating3star;
    //             console.log("rating3star.."+rating3star);
    //         };
    //         $scope.ratingsCallback5star = function(rating5star){
    //             $scope.rating3star = rating5star;
    //             console.log("rating5star.."+rating5star);
    //         };
    function convert_DT_addOneDay(str2) {
        var today = new Date(str2);
        var z = " 00:00";
        var str1 = new Date();
        str1 = str2.concat(z);
        var yr = str2.substring(0, 4);
        var mm = str2.substring(5, 7);
        mm = mm - 1;
        var dd = str2.substring(8, 10);
        var tomorrow = new Date(yr, mm, dd);
        console.log("Value in str1 console" + str1);
        console.log("Value in console" + tomorrow);
        //date added here to fix the issue-Earlier Build
        // tomorrow.setDate(today.getDate()+1); //commented in July 2018 Release

        // mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        // day = ("0" + (date.getDate()+1)).slice(-2);
        return [tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate()].join("-");
    }
    var ipObj2 = {
        callback: function (val) {  //Mandatory
            // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.dateValue1 = convert_DT(new Date(val));
            //  $scope.workorderCreation.workorderDate = convert_DT_addOneDay(new Date(val));
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

}]);
