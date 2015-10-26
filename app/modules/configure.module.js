(function () {

    'use strict';

    var _templateBase = '../../core/';

    angular.module('911MaintenanceApp.Configuration',['ngRoute']).config(Configure);

    Configure.$inject = ['$routeProvider'];

    function Configure($routeProvider) {

        $routeProvider
            .when('/Configure/Permission', {
                templateUrl: _templateBase + 'configure/permission/permission.html',
                controller: 'PermissionController',
                controllerAs: '_ctrl'
            })
            .when('/Configure/Users', {
                templateUrl: _templateBase + 'configure/user/user.html',
                controller: 'UserController',
                controllerAs: '_ctrl'
            })
            .when('/Configure/GroupAndTag', {
                templateUrl: _templateBase + 'configure/groupAndTag/groupAndTag.html',
                controller: 'GroupAndTagController',
                controllerAs: '_ctrl'
            })
            .when('/Configure/Common', {
                templateUrl: _templateBase + 'configure/common/common.html',
                controller: 'UserController',
                controllerAs: '_ctrl'
            })
            .when('/Configure', {
                templateUrl: _templateBase + 'configure/configure.html',
                controller: 'ConfigureController',
                controllerAs: '_ctrl'
            });

    }

})();