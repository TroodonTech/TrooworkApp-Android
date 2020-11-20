

myApp.controller('dashboardController', function (HOSTNAME, AUTH_HOSTNAME, $scope, $window) {
        $scope.serverLocation = HOSTNAME;
        var token = window.localStorage.getItem('token');
        $window.localStorage['token'] = token;
        var encodedProfile = token.split('.')[1];
        var profile = JSON.parse(url_base64_decode(encodedProfile));
        // console.log(profile);
        $scope.toServeremployeekey = profile.employeekey;
        $scope.username = profile.username;
        // console.log($scope.username);
        document.addEventListener("deviceready", function (){
                                                 window.screen.orientation.unlock(); // or ‘portrait’
                                                 }, false);

});
