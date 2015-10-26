/**
 * Created by Saron on 2015/10/1.
 */
'use strict';

var fs = require('fs');

String.prototype.format = function (arguments) {
    var formatted = this;
    for (var i = 0, l = arguments.length; i < l; i++) {
        //if (regexp == null || regexp.length == 0) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        //}
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var fileManager = {

    createFile: function (path) {
        var exist = fs.existsSync(path);
        if (!exist) {
            fs.open(path, 'w'
                , function (err, fd) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('file has created');
                });
        }
    },

    updateFile: function (path, arguments, template) {
        var data = template.format(arguments);
        fs.writeFileSync(path, data);
        console.log('operation update complete');
    },

    readFile: function (path) {
        var exist = fs.existsSync(path);
        if (!exist) return null;

        return fs.readFileSync(path);
        console.log('operation read complete');
    }
};

module.exports = fileManager;