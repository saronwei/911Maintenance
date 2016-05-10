/**
 * Created by Saron on 2016/5/3.
 */

function FileDetector() {
    "use strict";

    var fs = require('fs');
    var linq = require('linq');
    var path = require('path');
    var utils = require('util');

    return {
        Probe: probe
    };

    function probe(sourcePath, filename, option, callback) {
        fs.readdir(sourcePath, function (err, files) {
            if (err) {
                callback(null);
                return;
            }
            var fileGroup = [];
            for (var i = 0, j = files.length; i < j; i++) {
                var file = files[i];
                if (fs.statSync(path.join(sourcePath, file)).isDirectory()) {
                    probe(sourcePath, filename, option, callback);
                }
                else {
                    if (utils.isNullOrUndefined(filename) && filename != "") {
                        if (file.toString().indexOf(filename) > 0) {
                            callback(require(path.join(sourcePath, file)));
                            file = null;
                            return;
                        }
                    }
                    if (!utils.isNullOrUndefined(option) && option != "") {
                        if (option.hasOwnProperty('extension') && option['extension'] != "") {
                            var arr = option['extension'].toString().split('||');
                            var arr1 = file.toString().split('.');
                            if (Array.intersect(arr, arr1).length > 0) {
                                fileGroup.push(require(path.join(sourcePath, file)));
                            }
                            arr = null;
                            arr1 = null;
                        }
                    }
                }
                file = null;
            }
            if (fileGroup.length > 0) {
                callback(fileGroup);
                return;
            }
            callback(null);
        })
    }
}

module.exports = FileDetector;