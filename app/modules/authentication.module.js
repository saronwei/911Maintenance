(function () {

    'use strict';
    var _templateBase = '../../core/';

    angular.module('911MaintenanceApp.Authentication', ['ngRoute']).config(Configure);

    Configure.$inject = ['$routeProvider'];

    function Configure($routeProvider) {
        $routeProvider.when('/Login', {
            templateUrl: _templateBase + 'login/login.html',
            controller: 'LoginController',
            controllerAs: '_ctrl'
            //resolve: {
            //    preLoginService: preLoginService
            //}
        });
    }

    //preLoginService.$inject = ['LoginService','$location'];
    //function preLoginService(LoginService, $location) {
    //    var v = LoginService.check('123', 'pwd');
    //    if (!v) {
    //        $location.path('/');
    //    }
    //}

})();