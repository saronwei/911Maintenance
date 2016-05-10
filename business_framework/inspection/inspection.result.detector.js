/**
 * Created by Saron on 2016/5/11.
 */

function ResultsDetector() {
    "use strict";

    var utils = require('util');

    return {
        Detect: detect
    };

    function detect(result, testingBase) {

        if (utils.isNullOrUndefined(testingBase) || testingBase === "") {
            return true;
        }
        if (utils.isObject(testingBase)) {

            if (testingBase.prototype && testingBase.prototype.hasOwnProperty('Check')) {
                return testingBase.prototype.Check(result);
            }
        }

        return false;
    }
}

module.exports = ResultsDetector;