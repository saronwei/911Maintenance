(function () {

    'use strict';

    angular.module('911MaintenanceApp.Configuration')
        .controller('ConfigureController', ConfigureController);

    ConfigureController.$inject = ['ConfigureService'];

    /* @ngInject */
    function ConfigureController(ConfigureService) {

        var ctrl = this;

        Active();

        function Active() {
            readMaintenanceData();
        }

        function readMaintenanceData() {

        }

    }

})();