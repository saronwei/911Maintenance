(function () {

    'use strict';
    angular.module('911MaintenanceApp.File').factory('FileService', FileService);

    function FileService() {

        var fs = require('fs');

        return {
            create: createFile,
            update: updateFile,
            read: readFile,
            delete: deleteFile
        };

        function createFile(path, data) {

            var isCreate = false;
            var exist = fs.existsSync(path);
            if (!exist) {
                fs.open(path, 'w'
                    , function (err, fd) {
                        if (err) {
                            return console.error(err);
                        }
                        isCreate = true;
                        console.log('file has created');
                    });
            }
            return isCreate;
        }

        function updateFile(path, data) {
           return fs.writeFileSync(path, data);
        }

        function readFile(path) {
            var exist = fs.existsSync(path);
            if (!exist) return null;

            console.log('operation read complete');
            return fs.readFileSync(path);
        }

        function deleteFile(path) {

        }
    }


})();