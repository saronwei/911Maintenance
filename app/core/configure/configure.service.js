(function(){

    'use strict';

    angular.module('911MaintenanceApp.Configuration')
        .factory('ConfigureService', ConfigureService);

    ConfigureService.$inject = ['$http'];

    /* @ngInject */
    function ConfigureService($http){

        return {
            getMaintenanceData: getMaintenanceData
        };

        function getMaintenanceData()
        {
            return $http.get('/api/maintenance/readData');
        }

    }

})();