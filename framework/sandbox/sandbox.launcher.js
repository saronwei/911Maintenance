/**
 * Created by Saron on 2016/4/19.
 */

/*
 * async method shell, provider the error catch of the async callback etc
 */
function SandBox(fn, arg1, arg2, arg3, arg4, arg5, arg6, arg7, callback) {

    var d = require('domain').createDomain();
    var utils = require('util');

    d.on("error", function (err) {
        console.log(err);
    });

    d.run(function () {
        fn(arg1, arg2, arg3, arg4, arg5, arg6, arg7, function (err, result) {
            "use strict";
            if (err) {
                throw err;
            }
            if (utils.isFunction(callback)) {
                callback(null, result);
            }
        });
    });

    return {
        Release: function release() {
            fn = null;
            d = null;
        },
        Include: function include(asyncObj) {
            d.add(asyncObj);
        }
    }
}

module.exports = SandBox;
