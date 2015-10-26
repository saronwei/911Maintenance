(function () {

    'use strict';
    var _templateBase = '../../core/';

    angular.module('911MaintenanceApp.File', []);
    angular.module('911MaintenanceApp.Configuration', ['ngRoute']);
    angular.module('911MaintenanceApp.Authentication', ['ngRoute']);
    angular.module('911MaintenanceApp', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        '911MaintenanceApp.File',
        '911MaintenanceApp.Configuration',
        '911MaintenanceApp.Authentication'
    ]).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: _templateBase + 'home/home.html',
                controller: 'HomeController',
                controllerAs: '_ctrl',
                resolve: {
                    preHomeService: preHomeService
                }
            })
            .otherwise({redirectTo: '/Login'});
    }]);

    preHomeService.$inject = ['$location','LoginService'];
    function preHomeService($location, LoginService){

        var v = LoginService.check('123', 'pwd');
        if (!v) {
            $location.path('/Login');
        }

    }

})();