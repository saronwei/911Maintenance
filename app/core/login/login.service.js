(function () {

    'use strict';

    angular.module('911MaintenanceApp.Authentication').factory('LoginService', LoginService);

    LoginService.$inject = ['$http'];

    /* @ngInject */
    function LoginService($http) {

        // define the interface of the service, must define the service like this style
        return {
            check: check
        };

        function check(username, pwd) {
            //return $http.get('/api/login');
            return false;
        }


    }

})();