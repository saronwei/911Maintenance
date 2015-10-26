(function () {

    'use strict';

    angular.module('911MaintenanceApp.Authentication')
        .controller('LoginController', LoginController);

    // define the dependencies by manually is good for javascript save zipped
    LoginController.$inject = ['LoginService'];

    /* @ngInject */
    function LoginController(LoginService) {

        var ctrl = this;

        //notice: when the view is loaded and u wanna the controller execute the logic right now
        //u must define a active function to implement this idea! like the controller's constructor.
        //by this way, u can coding a good unit_test for controller without thinking any other things
        //Active();
        //function active(){}

        ctrl.onLogin = function (username, pwd) {
            return getCheckResult(username, pwd);
        };

        function getCheckResult(username, pwd) {
            return LoginService.check(username, pwd)
                .then(function (data) {

                })
        }
    }
})();



