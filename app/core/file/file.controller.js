(function () {

    'use strict';
    angular.module('911MaintenanceApp.File').controller('FileController', FileController);

    //String.prototype.format = function (arguments) {
    //    var formatted = this;
    //    for (var i = 0, l = arguments.length; i < l; i++) {
    //        //if (regexp == null || regexp.length == 0) {
    //        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
    //        //}
    //        formatted = formatted.replace(regexp, arguments[i]);
    //    }
    //    return formatted;
    //};

    FileController.$inject = ['FileService'];

    function FileController(FileService) {

        function createFile(path) {
           return FileService.create(path);
        }

        function updateFile(path,data) {
            return FileService.update(path, data);
        }

        function readFile(path) {
            return FileService.read(path);
        }
    }

})();