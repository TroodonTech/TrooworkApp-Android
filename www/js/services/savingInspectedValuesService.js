
myApp.service('savingInspectedValuesService' ,['$http', '$q', 'HOSTNAME', function ($http, $q,hostname){
        var ControllerURL=hostname;
        
        return {
            saveinspectedQuestions: function(saveInspection) {
               
                return $http.post(ControllerURL + "/saveinspectedQuestions",saveInspection)
                    .then(function(response) {
//                        
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            // invalid response
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });
            }
        };
    }]);



